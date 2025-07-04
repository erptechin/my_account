// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

const pageName = "Case"
const doctype = "Docket"

const section_lists = ['section_break_n4h60', 'section_break_wbii', 'section_break_3gpim', 'section_break_qwmbq', 'bond_details_section', 'section_break_7h1go', 'get_hearing_at_glance', 'column_break_z8a1a', 'column_break_qewps', 'column_break_drnys', 'column_break_dmer3', 'column_break_tsesv', 'column_break_egal', 'column_break_eakzy']
const field_lists = [ 'case_title', 'case_status', 'modified_date', 'full_name', 'dob', 'd_address', 'latest_hearing_date', 'hearing_time', 'offence_code', 'description', 'offense_date', 'citation_number', 'amended_charge', 'fine_amount', 'court_cost', 'contempt_fee', 'total_fine', 'balance_amount', 'bondamount', 'bond_number']

// ----------------------------------------------------------------------

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [fields, setFields] = useState(null)
  const [initialState, setInitialState] = useState({})
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...section_lists, ...field_lists]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: fields ? JSON.stringify(fields) : null });

  useEffect(() => {
    if (info?.fields) {
      let fields = info?.fields.map(item => item.fieldname)
      setFields(fields)
      setInitialState(Object.fromEntries(fields.map(field => [field, ""])))
    }
  }, [info?.fields])

  const mutationAdd = useAddData((data) => {
    if (data) {
      reset();
      navigate(-1)
    }
  });

  const mutationUpdate = useUpdateData((data) => {
    if (data) {
      reset();
      navigate(-1)
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: id ? data : initialState,
  });

  const onSubmit = (data) => {
    if (id) {
      mutationUpdate.mutate({ doctype, body: { ...data, id } })
    } else {
      mutationAdd.mutate({ doctype, body: data })
    }
  };

  if (isFetchingInfo || isFetchingData) {
    return <Skeleton
      style={{
        "--sk-color": isDark ? darkColorScheme[700] : lightColorScheme[300],
      }}
    />
  }
  return (
    <Page title={(id ? 'Edit ' : "New ") + pageName}>
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {id ? 'Edit' : "New"} {pageName}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            {/* <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="new-post-form"
            >
              Save
            </Button> */}
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="new-post-form"
        >
          <DynamicForms
            infos={info?.fields}
            register={register}
            control={control}
            errors={errors}
          />
          {/* <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12 lg:col-span-8">
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5">
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Driver License Info</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_1}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Cost Details</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_2}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                <h3><strong>Bond Details</strong></h3>
                <DynamicForms
                  infos={info?.fields}
                  fields={subFields}
                  register={register}
                  control={control}
                  errors={errors}
                />
              </Card>
            </div>
          </div> */}
        </form>
      </div>
    </Page>
  );
};
