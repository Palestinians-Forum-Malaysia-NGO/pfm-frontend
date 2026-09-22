import { canUserSeeProject, getProjectAudience } from "./projectVisibility";

describe("project visibility", () => {
  test("drafts stay private unless the owner is viewing them", () => {
    const draft = {
      id: 1,
      is_published: false,
      is_featured: false,
      classification_ids: [2],
      created_by: "Jane Smith",
    };

    expect(canUserSeeProject(draft, null)).toBe(false);
    expect(canUserSeeProject(draft, { id: 99, full_name: "Jane Smith" })).toBe(
      true
    );
    expect(getProjectAudience(draft)).toBe("draft");
  });

  test("published niche projects are visible only to matching classification users", () => {
    const niche = {
      id: 2,
      is_published: true,
      is_featured: false,
      classification_ids: [2, 3],
      classifications: [{ id: 2 }, { id: 3 }],
    };

    expect(canUserSeeProject(niche, { classifications: [{ id: 1 }] })).toBe(
      false
    );
    expect(canUserSeeProject(niche, { classifications: [{ id: 3 }] })).toBe(
      true
    );
    expect(getProjectAudience(niche)).toBe("niche");
  });

  test("published non-niche and featured projects are public", () => {
    const publicProject = {
      id: 3,
      is_published: true,
      is_featured: false,
      classification_ids: [],
    };
    const featuredProject = {
      id: 4,
      is_published: true,
      is_featured: true,
      classification_ids: [],
    };

    expect(canUserSeeProject(publicProject, null)).toBe(true);
    expect(canUserSeeProject(featuredProject, null)).toBe(true);
    expect(getProjectAudience(publicProject)).toBe("all");
    expect(getProjectAudience(featuredProject)).toBe("featured");
  });
});
