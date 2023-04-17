import IUser from "../interfaces/user";
import { createUser } from "../services/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "./admin.css";

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup
      .string()
      .min(8, "Minimum 8 caractères.")
      .max(100, "Maximum 100 caractères")
      .required(),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
    name: yup
      .string()
      .required()
      .min(2, "Minimum 2 caractères.")
      .max(100, "Maximum 100 caractères"),
  })
  .required();

export default function Admin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const displayError = (type: string) => {
    return (
      errors[type] && (
        <div className="admin_form_error">
          {errors[type]?.message as React.ReactNode}
        </div>
      )
    );
  };

  async function onSubmit(data: any) {
    const user: IUser = {
      id: 0,
      email: data.email,
      password: data.password,
      name: data.name,
      isAdmin: false,
    };

    const userCreated = await createUser(user);
    if (userCreated.error || !userCreated.user) toast.error(userCreated.error);
    else toast.success("Utilisateur créé avec succès.");
  }

  return (
    <form
      id="createUserForm"
      className="admin_form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <div className="admin_form_title">
          Création d'un nouvel utilisateur :
        </div>
        <div className="admin_form_row">
          <label>Adresse email :</label>
          <input type="email" {...register("email")}></input>
          {displayError("email")}
        </div>
        <div className="admin_form_row">
          <label>Mot de passe :</label>
          <input type="password" {...register("password")}></input>
          {displayError("password")}
        </div>
        <div className="admin_form_row">
          <label>Confirmation du mot de passe :</label>
          <input type="password" {...register("passwordConfirmation")}></input>
          {displayError("passwordConfirmation")}
        </div>
        <div className="admin_form_row">
          <label>Nom :</label>
          <input type="text" {...register("name")}></input>
          {displayError("name")}
        </div>
        <div></div>
        <div className="admin_form_confirm_container">
          <input className="admin_form_confirm" type="submit" value="Valider" />
        </div>
      </div>
    </form>
  );
}
