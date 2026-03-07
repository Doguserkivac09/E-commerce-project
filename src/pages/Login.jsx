import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { loginThunk } from "../redux/actions/clientActions";

function Login() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data) => {
    setSubmitLoading(true);
    dispatch(
      loginThunk(
        { email: data.email.trim(), password: data.password },
        data.rememberMe
      )
    )
      .then(() => {
        const from = location.state?.from || "/";
        history.replace(from);
      })
      .catch(() => {
        toast.error("Giriş başarısız. E-posta veya şifre hatalı.");
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Giriş</p>
        <h1 className="text-2xl md:text-3xl font-semibold">Hesabına Giriş Yap</h1>
        <p className="text-xs md:text-sm text-gray-500">
          Test: customer@commerce.com / store@commerce.com / admin@commerce.com (Şifre: 123456)
        </p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            placeholder="ornek@mail.com"
            {...register("email", {
              required: "E-posta zorunludur",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Geçerli bir e-posta girin",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            placeholder="Şifre"
            {...register("password", { required: "Şifre zorunludur" })}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300"
            {...register("rememberMe")}
          />
          <label className="text-sm text-gray-700" htmlFor="rememberMe">
            Beni hatırla (token tarayıcıda saklansın)
          </label>
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white text-sm font-medium py-2.5 px-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
