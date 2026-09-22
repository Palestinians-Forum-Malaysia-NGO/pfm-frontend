const toIdString = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "object")
    return value.id != null ? String(value.id) : null;
  return String(value);
};

export const getProjectClassificationIds = (project = {}) => {
  const ids = [
    ...(Array.isArray(project.classification_ids)
      ? project.classification_ids
      : []),
    ...(Array.isArray(project.classifications)
      ? project.classifications.map((c) => c?.id ?? c)
      : []),
  ];

  return [...new Set(ids.map((id) => toIdString(id)).filter(Boolean))];
};

export const getUserClassificationIds = (user = {}) => {
  const ids = Array.isArray(user.classifications)
    ? user.classifications.map((c) => c?.id ?? c)
    : [];
  return [...new Set(ids.map((id) => toIdString(id)).filter(Boolean))];
};

export const isProjectOwner = (project = {}, user = null) => {
  if (!project || !user) return false;

  const ownerFields = [
    project.created_by,
    project.created_by_name,
    project.owner_name,
    project.owner_full_name,
  ];

  if (
    ownerFields.some(
      (value) => value && user.full_name && value === user.full_name
    )
  )
    return true;

  const identityFields = [
    project.created_by_id,
    project.owner_id,
    project.user_id,
    project.created_by?.id,
  ];

  const userId = user.id;
  return identityFields.some(
    (value) =>
      value != null && userId != null && Number(value) === Number(userId)
  );
};

export const getProjectAudience = (project = {}) => {
  if (!project) return "draft";
  if (!project.is_published) return "draft";
  if (project.is_featured) return "featured";
  return getProjectClassificationIds(project).length ? "niche" : "all";
};

export const canUserSeeProject = (project = {}, user = null) => {
  if (!project) return false;

  if (!project.is_published) {
    return isProjectOwner(project, user);
  }

  if (project.is_featured) {
    return true;
  }

  const projectClassificationIds = getProjectClassificationIds(project);
  if (!projectClassificationIds.length) {
    return true;
  }

  if (!user) {
    return false;
  }

  const userClassificationIds = getUserClassificationIds(user);
  if (!userClassificationIds.length) {
    return false;
  }

  return projectClassificationIds.some((id) =>
    userClassificationIds.includes(id)
  );
};
