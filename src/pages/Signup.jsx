import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import workintechApi from "../api/workintech";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-_+().])[A-Za-z\d@$!%*?&#\-_+().]{8,}$/;
const TAX_NO_REGEX = /^T\d{4}V\d{6}$/;
const TR_PHONE_REGEX = /^0?5\d{9}$/;
const TR_IBAN_REGEX = /^TR\d{24}$/;

function Signup() {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_id: "",
      store: {
        name: "",
        phone: "",
        tax_no: "",
        bank_account: "",
      },
    },
  });

  const selectedRoleId = watch("role_id");
  const selectedRole = roles.find((r) => String(r.id) === String(selectedRoleId));
  const isStoreRole =
    selectedRole && selectedRole.name && selectedRole.name.toLowerCase().includes("store");

  useEffect(() => {
    workintechApi
      .get("/roles")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setRoles(list);
        const customer = list.find(
          (r) => r.name && r.name.toLowerCase() === "customer"
        );
        if (customer) {
          setValue("role_id", String(customer.id));
        } else if (list.length > 0) {
          setValue("role_id", String(list[0].id));
        }
      })
      .catch(() => {
        setRoles([]);
      })
      .finally(() => {
        setRolesLoading(false);
      });
  }, [setValue]);

  const onSubmit = (data) => {
    setServerError("");
    setSubmitLoading(true);

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role_id: Number(data.role_id),
    };

    if (isStoreRole && data.store) {
      payload.store = {
        name: data.store.name.trim(),
        phone: data.store.phone.replace(/\s/g, ""),
        tax_no: data.store.tax_no.trim(),
        bank_account: data.store.bank_account.replace(/\s/g, ""),
      };
    }

    workintechApi
      .post("/signup", payload)
      .then(() => {
        toast.warning(
          "You need to click link in email to activate your account!"
        );
        history.goBack();
      })
      .catch((err) => {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Kayıt sırasında bir hata oluştu.";
        setServerError(message);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Kayıt</p>
        <h1 className="text-2xl md:text-3xl font-semibold">Yeni Hesap Oluştur</h1>
        <p className="text-xs md:text-sm text-gray-500">
          Formu doldurarak yeni bir hesap oluşturabilirsiniz.
        </p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6"
      >
        {serverError && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {serverError}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="name">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            placeholder="En az 3 karakter"
            {...register("name", {
              required: "Ad soyad zorunludur",
              minLength: {
                value: 3,
                message: "En az 3 karakter olmalıdır",
              },
            })}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

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
            placeholder="En az 8 karakter, büyük/küçük harf, rakam ve özel karakter"
            {...register("password", {
              required: "Şifre zorunludur",
              minLength: {
                value: 8,
                message: "En az 8 karakter olmalıdır",
              },
              pattern: {
                value: PASSWORD_REGEX,
                message:
                  "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir",
              },
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            Şifre Tekrar
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            placeholder="Şifrenizi tekrar girin"
            {...register("confirmPassword", {
              required: "Şifre tekrarı zorunludur",
              validate: (v) =>
                v === watch("password") || "Şifreler eşleşmiyor",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="role_id">
            Rol
          </label>
          <select
            id="role_id"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500 bg-white"
            {...register("role_id", { required: "Rol seçiniz" })}
            disabled={rolesLoading}
          >
            {rolesLoading && (
              <option value="">Yükleniyor...</option>
            )}
            {!rolesLoading &&
              roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || `Rol ${r.id}`}
                </option>
              ))}
          </select>
          {errors.role_id && (
            <p className="text-xs text-red-600">{errors.role_id.message}</p>
          )}
        </div>

        {isStoreRole && (
          <div className="flex flex-col gap-4 pt-2 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Mağaza Bilgileri</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="store.name">
                Mağaza Adı
              </label>
              <input
                id="store.name"
                type="text"
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
                placeholder="En az 3 karakter"
                {...register("store.name", {
                  required: isStoreRole ? "Mağaza adı zorunludur" : false,
                  minLength: {
                    value: 3,
                    message: "En az 3 karakter olmalıdır",
                  },
                })}
              />
              {errors.store?.name && (
                <p className="text-xs text-red-600">{errors.store.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="store.phone">
                Mağaza Telefon
              </label>
              <input
                id="store.phone"
                type="tel"
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
                placeholder="05XXXXXXXXX"
                {...register("store.phone", {
                  required: isStoreRole ? "Telefon zorunludur" : false,
                  pattern: {
                    value: TR_PHONE_REGEX,
                    message: "Geçerli bir Türkiye telefon numarası girin (05XXXXXXXXX)",
                  },
                })}
              />
              {errors.store?.phone && (
                <p className="text-xs text-red-600">{errors.store.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="store.tax_no">
                Vergi No
              </label>
              <input
                id="store.tax_no"
                type="text"
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
                placeholder="T1234V123456"
                {...register("store.tax_no", {
                  required: isStoreRole ? "Vergi numarası zorunludur" : false,
                  pattern: {
                    value: TAX_NO_REGEX,
                    message: "Format: T ile başlayıp 4 rakam, V ve 6 rakam (örn. T1234V123456)",
                  },
                })}
              />
              {errors.store?.tax_no && (
                <p className="text-xs text-red-600">{errors.store.tax_no.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="store.bank_account">
                Banka Hesabı (IBAN)
              </label>
              <input
                id="store.bank_account"
                type="text"
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
                placeholder="TR330006100519786457841326"
                {...register("store.bank_account", {
                  required: isStoreRole ? "IBAN zorunludur" : false,
                  pattern: {
                    value: TR_IBAN_REGEX,
                    message: "Geçerli TR IBAN girin (TR + 24 rakam)",
                  },
                })}
              />
              {errors.store?.bank_account && (
                <p className="text-xs text-red-600">
                  {errors.store.bank_account.message}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitLoading}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white text-sm font-medium py-2.5 px-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            "Kayıt Ol"
          )}
        </button>
      </form>
    </div>
  );
}

export default Signup;
