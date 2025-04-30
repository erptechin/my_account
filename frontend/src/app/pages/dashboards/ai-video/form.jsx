// Import Dependencies
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Skeleton,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Tag
} from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import DynamicForms from 'app/components/form/dynamicForms';
import { SearchSelect } from "app/components/form/SearchSelect";
import { getSingleData, getCustomData } from 'utils/apis';
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

const steps = [
  {
    key: "1",
    label: "Select brand or add new brand",
  },
  {
    key: "2",
    label: "Select the Product and Target Audience (or create new)",
  },
  {
    key: "3",
    label: "Select the Media Channels or desired size",
  },
  {
    key: "4",
    label: "Select the Image Style or Colour composition (or camera settings)",
  },
  {
    key: "5",
    label: "Write details about the desired image in prompt section",
  },
];

const doctype = "Text To Video"
const field1 = ['campaign_name', 'objective', 'product', 'target_group']
const field2 = ['social_media_creatives']
const field3 = ['color_composition', 'context_of_image', 'elements_my_image', 'image_style']
const field4 = ['manual_prompt']
const field5 = ['social_media_size', 'asset_list']

const tableFields = {
  "target_group": { "target_group": ["target_name", "type", "gender", "age_group"] },
  "color_composition": { "color": true }
}

// ----------------------------------------------------------------------

const initialState = Object.fromEntries(
  [...field1, ...field2, ...field3, ...field4, ...field5].map(field => [field, ""])
);

export default function AddEditFrom() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState('1')
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...field1, ...field2, ...field3, ...field4, ...field5]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: JSON.stringify([...field1, ...field2, ...field3, ...field4, ...field5]) });
  const [mediaSizes, setMediaSizes] = useState([])
  const [banners, setBanners] = useState([])
  const [generate, setGenerate] = useState(false)

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
    watch,
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: id ? data : initialState,
  });

  const [social_media, social_media_size] = watch(['social_media_creatives', 'social_media_size']);
  const [width, height] = social_media_size ? social_media_size.split('X').map(Number) : [];

  useEffect(() => {
    if (social_media) {
      getSingleData({ id: social_media, doctype: "Social Media", fields: JSON.stringify(["name", "sizes"]) }).then((data) => {
        setMediaSizes((data.sizes).map((item) => {
          return { label: `${item.width}X${item.height}`, value: `${item.width}X${item.height}` }
        }))
      })
    } else {
      setMediaSizes([])
    }
  }, [social_media])

  const onSubmit = (data) => {
    if (!user.brandId) {
      return toast.error("Please Create a Brand");
    }

    if (id) {
      mutationUpdate.mutate({ doctype, body: { ...data, id } })
    } else {
      mutationAdd.mutate({ doctype, body: { ...data, client: user.clientId, brand: user.brandId, type: "Image" } })
    }
  };

  const generateImage = () => {
    if (!generate) {
      setGenerate(true)
      getCustomData({ url: "erptech_ads.api.ai_data.text_to_image", args: { name: id } }).then((data) => {
        setBanners([...banners, data])
        setGenerate(false)
        queryClient.invalidateQueries({ queryKey: ['text-to-image'] })
      }).caches(() => {
        toast.error("Image generated failed, try again");
        setGenerate(false)
      })
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
    <Page title="New Post Form">
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              New {doctype}
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
                <Accordion defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionButton onClick={() => setStep('1')} className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700">
                      {({ open }) => (
                        <>
                          <p>Branding Details</p>
                          <div
                            className={clsx(
                              "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                              open && "-rotate-180",
                            )}
                          >
                            <ChevronDownIcon className="size-6" />
                          </div>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel>
                      {user?.brandName ? <Button color="warning">{user?.brandName}</Button> : <Button onClick={() => navigate("/dashboards/brand")} color="warning">{"Please Create a Brand"}</Button>}
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionButton onClick={() => setStep('2')} className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700">
                      {({ open }) => (
                        <>
                          <p>Campaign Overview</p>
                          <div
                            className={clsx(
                              "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                              open && "-rotate-180",
                            )}
                          >
                            <ChevronDownIcon className="size-6" />
                          </div>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel>
                      <DynamicForms
                        infos={info?.fields}
                        fields={field1}
                        register={register}
                        control={control}
                        errors={errors}
                        tables={tableFields}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionButton onClick={() => setStep('3')} className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700">
                      {({ open }) => (
                        <>
                          <p>Media Channels</p>
                          <div
                            className={clsx(
                              "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                              open && "-rotate-180",
                            )}
                          >
                            <ChevronDownIcon className="size-6" />
                          </div>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel>
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8">
                          <DynamicForms
                            infos={info?.fields}
                            fields={field2}
                            register={register}
                            control={control}
                            errors={errors}
                            tables={tableFields}
                          />
                          {mediaSizes.length > 0 && (
                            <div className="mt-2">
                              <Controller
                                render={({ field: { onChange, value, ...rest } }) => {
                                  return <SearchSelect
                                    onChange={onChange}
                                    value={value}
                                    label="Social Media Size"
                                    lists={mediaSizes}
                                    placeholder="Social Media Size"
                                    isAddNew={false}
                                    rootItem={null}
                                    error={errors?.social_media_size?.message}
                                    {...rest}
                                  />
                                }}
                                control={control}
                                name={'social_media_size'}
                                {...register('social_media_size')}
                              />
                            </div>)}
                        </div>
                        <div className="col-span-4">
                          {social_media_size && (<Tag className={`mt-1`} style={{ display: 'flex', width: `${width / 2}px`, height: `${height / 2}px` }}>{social_media_size}</Tag>)}
                        </div>
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionButton onClick={() => setStep('4')} className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700">
                      {({ open }) => (
                        <>
                          <p>Creative Design</p>
                          <div
                            className={clsx(
                              "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                              open && "-rotate-180",
                            )}
                          >
                            <ChevronDownIcon className="size-6" />
                          </div>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel>
                      <DynamicForms
                        infos={info?.fields}
                        fields={field3}
                        register={register}
                        control={control}
                        errors={errors}
                        tables={tableFields}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionButton onClick={() => setStep('5')} className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700">
                      {({ open }) => (
                        <>
                          <p>Prompt</p>
                          <div
                            className={clsx(
                              "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                              open && "-rotate-180",
                            )}
                          >
                            <ChevronDownIcon className="size-6" />
                          </div>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel>
                      <DynamicForms
                        infos={info?.fields}
                        fields={field4}
                        register={register}
                        control={control}
                        errors={errors}
                        tables={tableFields}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                {steps.map((item, key) => <div key={key}>
                  <h4 className={clsx(
                    "text-sm font-normal leading-none text-gray-400",
                    step == item.key && "text-success",
                  )}>{item.label}</h4>
                </div>)}
                <h3 className="font-bold">After Image Generation Save Image and Add Branding elements</h3>


                {id && (<Button
                  type="button"
                  onClick={handleSubmit(generateImage)}
                  className="min-w-[7rem]"
                  color="warning"
                >
                  {generate ? "Generating..." : "Generate Image"}
                </Button>)}

                {data && data.asset_list && (
                  <div className="max-w-md">
                    <swiper-container
                      effect="flip"
                      navigation="true"
                      slides-per-view="1"
                      dir={'ltr'}
                      style={{
                        "--swiper-navigation-size": "32px",
                        "--swiper-theme-color": "#51a2ff",
                        "--swiper-pagination-color": "#155dfc",
                      }}
                    >
                      {(data.asset_list).reverse().map(({ file, name }) => (
                        <swiper-slide key={name}>
                          <img
                            className="h-full w-full rounded-lg object-cover"
                            src={file}
                            alt="object"
                            loading="lazy"
                          />
                        </swiper-slide>
                      ))}
                    </swiper-container>
                  </div>
                )}

              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
