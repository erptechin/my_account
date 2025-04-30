// Import Dependencies
import { Page } from "components/shared/Page";
import { useParams } from "react-router";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { useState } from "react";
import { JWT_HOST_API } from 'configs/auth.config';

// Local Imports
import { Avatar } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { useFeachData } from "hooks/useApiHook";

// ----------------------------------------------------------------------

const doctype = "Asset Manage"
const fields = ['name', 'type', 'file']

export default function Inner() {
  const { user } = useAuthContext();
  const { type } = useParams();
  const [search, setSearch] = useState({ doctype, page: 1, page_length: 10, filters: JSON.stringify([[doctype, "client", "=", user?.clientId], [doctype, "type", "=", type]]), fields: JSON.stringify(fields) });
  const { data } = useFeachData(search);

  return (
    <Page title={`Assets ${type}`}>
      <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] px-(--margin-x) py-4">
        <div className="flex items-center justify-between space-x-4 ">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {doctype}s - {type}
            </h2>
          </div>
        </div>

        <div className={"flex flex-col pt-4"}>
          <div className="grid max-w-4xl grid-cols-4 gap-4 mx-auto">
            {data?.data.map((item, key) => <div key={key}>
              <Avatar size={14} src={item.file ? `${JWT_HOST_API}${item.file}` : "/images/200x200.png"} />
            </div>)}
          </div>
        </div>
        <PaginationSection table={null} count={data?.counts ?? 0} search={search} setSearch={setSearch} />
      </div>
    </Page>
  );
}
