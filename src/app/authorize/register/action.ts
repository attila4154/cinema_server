"use server";
export async function formAction(formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(data);
  console.log(formData);
}
