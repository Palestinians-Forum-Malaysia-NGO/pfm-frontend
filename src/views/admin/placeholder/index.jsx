import { MdConstruction } from "react-icons/md";

const Placeholder = ({ pageName = "This Page" }) => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50">
          <MdConstruction className="h-10 w-10 text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-navy-700">{pageName}</h2>
        <p className="mt-2 text-sm text-gray-600">
          This section is currently under development.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Palestinian Forum Malaysia — coming soon.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
