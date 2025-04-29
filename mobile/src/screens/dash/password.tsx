import React, { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { MainWapper, InputBox, ButtonBox } from "@/src/components/utility";

import { useChangePassword } from '@/src/hooks';
import { MainContext } from "@/src/contexts";
import { useNavigation } from "@react-navigation/native";

export default function Password() {
  const navigation = useNavigation();
  const { labels, user } = useContext(MainContext)
  const mutation = useChangePassword((data: any) => {
    if (data) {
      navigation.navigate("profile")
    }
  });

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: ""
  }

  const validationSchema = Yup.object().shape({
    old_password: Yup.string()
      .required(labels.password1),
    new_password: Yup.string()
      .required(labels.password2)
      .min(8, labels.password_error1)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        labels.password_error2
      ),
    confirm_password: Yup.string()
      .required(labels.password3)
      .oneOf([Yup.ref("new_password")], labels.password_error3)
  });

  const onPressHandle = async (values: any) => {
    mutation.mutate({ ...values, user: user.email });
  };

  return (
    <>
      <MainWapper backgroundColor={'rgb(29, 191, 115)'}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onPressHandle(values)}
        >
          {({ handleSubmit }) => {
            return <>
              <InputBox
                error={true}
                required={true}
                label={labels.currentPassword}
                name="old_password"
                className="mb_30"
                type="password"
              />
              <InputBox
                error={true}
                required={true}
                label={labels.newPassword}
                name="new_password"
                className="mb_30"
                type="password"
              />
              <InputBox
                error={true}
                required={true}
                label={labels.confirmPassword}
                name="confirm_password"
                className="mb_30"
                type="password"
              />
              <ButtonBox value={labels.saveChanges} isLoading={mutation.isPending} onClick={handleSubmit} />
            </>
          }}
        </Formik>
      </MainWapper>
    </>
  );
}