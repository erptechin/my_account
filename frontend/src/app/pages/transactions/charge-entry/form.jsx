// Import Dependencies
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

const doctype = "Charge Entry"
const fields = ['document_type', 'offense_date', 'filed_date', 'citation_number', 'time_of_violation_24_hrss', 'custom_aa']
const fields_1 = ['violator_first_name', 'violator_middle_name', 'violator_last_name', 'defendant_suffix', 'street_address', 'street_address_line_2', 'vl_city', 'vl_state', 'zipcode_5', 'zipcode_4', 'vl_country', 'vl_mobile_no', 'email', 'social_security_number', 'dob', 'violator_age', 'race', 'defendant_gender', 'defendant_ethnicity', 'hair_color', 'height', 'eye_color', 'legacy_race']
const fields_2 = ['driving_licence_no', 'dl_state', 'dl_class', 'is_licence_cdl']
const fields_3 = ['make_year', 'vehicle_make', 'commercial', 'model', 'colour', 'licence_number', 'license_plate_state', 'vehicle_registration_year', 'vin']
const fields_4 = ['inc_location_type', 'inc_street_address', 'inc_street_address_line_2', 'on_city', 'inc_state', 'inc_zip4', 'offence_code', 'witness_table']
const fields_5 = ['notes']
const subFields = ['is_the_defendant_out_on_bond', 'bond_type', 'bond_amount', 'bonding_company_agent', 'bonding_insurance_company_name', 'bond_number', 'was_bond_forfeitured_']

const tableFields = {
  "offence_code": { "violation_code": true, "docet": true, "violation_codes": true, "description": true },
  "witness_table": { "offence_code": true, "name1": true, "docket": true }
}

// ----------------------------------------------------------------------

const initialState = Object.fromEntries(
  [...fields, ...fields_1, ...fields_2, ...fields_3, ...fields_4, ...fields_5, ...subFields].map(field => [field, ""])
);

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...fields, ...fields_1, ...fields_2, ...fields_3, ...fields_4, ...fields_5, ...subFields]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: JSON.stringify([...fields, ...fields_1, ...fields_2, ...fields_3, ...fields_4, ...fields_5, ...subFields]) });

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
    <Page title={(id ? 'Edit ' : "New ") + doctype}>
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {id ? 'Edit' : "New"} {doctype}
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
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="new-post-form"
            >
              Save
            </Button>
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="new-post-form"
        >
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
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
                  <h3><strong>Defendant Personal Details</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_1}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Driver License Info</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_2}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Vehicle Details</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_3}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Incident Details</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_4}
                    tables={tableFields}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                  <h3><strong>Notes</strong></h3>
                  <DynamicForms
                    infos={info?.fields}
                    fields={fields_5}
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
          </div>
        </form>
      </div>
    </Page>
  );
};
