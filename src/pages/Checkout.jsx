import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import {
  fetchAddressesThunk,
  addAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  fetchCardsThunk,
  addCardThunk,
  updateCardThunk,
  deleteCardThunk,
} from "../redux/actions/clientActions";
import { createOrderThunk } from "../redux/actions/orderActions";
import { CITIES } from "../utils/cities";

const SHIPPING_PRICE = 29.99;
const FREE_SHIPPING_THRESHOLD = 150;

function formatPrice(n) {
  return Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
}

const emptyForm = {
  title: "",
  name: "",
  surname: "",
  phone: "",
  city: "",
  district: "",
  neighborhood: "",
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => currentYear + i);

const emptyCardForm = {
  card_no: "",
  expire_month: "",
  expire_year: "",
  name_on_card: "",
};

function Checkout() {
  const dispatch = useDispatch();
  const history = useHistory();
  const addressList = useSelector((state) => state.client?.addressList || []);
  const creditCards = useSelector((state) => state.client?.creditCards || []);
  const cart = useSelector((state) => state.shoppingCart?.cart || []);

  const [step, setStep] = useState(1);
  const [deliveryAddressId, setDeliveryAddressId] = useState(null);
  const [invoiceSameAsDelivery, setInvoiceSameAsDelivery] = useState(true);
  const [invoiceAddressId, setInvoiceAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [use3DSecure, setUse3DSecure] = useState(false);
  const [cardCvv, setCardCvv] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAddressesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (step === 2) dispatch(fetchCardsThunk());
  }, [dispatch, step]);

  const selectedTotal = cart.reduce((sum, item) => {
    if (!item.checked || !item.product) return sum;
    const price = Number(item.product.price);
    if (Number.isNaN(price)) return sum;
    return sum + price * item.count;
  }, 0);
  const selectedCount = cart.filter((item) => item.checked).length;
  const shippingTotal = selectedTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const shippingDiscount = selectedTotal >= FREE_SHIPPING_THRESHOLD ? SHIPPING_PRICE : 0;
  const grandTotal = selectedTotal + shippingTotal - shippingDiscount;

  const openAddForm = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setEditingAddress(addr);
    setForm({
      title: addr.title || "",
      name: addr.name || "",
      surname: addr.surname || "",
      phone: addr.phone || "",
      city: addr.city || "",
      district: addr.district || "",
      neighborhood: addr.neighborhood || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      name: form.name.trim(),
      surname: form.surname.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      neighborhood: form.neighborhood.trim(),
    };
    if (editingAddress && editingAddress.id != null) {
      dispatch(updateAddressThunk({ ...payload, id: editingAddress.id })).then(closeForm);
    } else {
      dispatch(addAddressThunk(payload)).then(closeForm);
    }
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      dispatch(deleteAddressThunk(addressId));
      if (deliveryAddressId === addressId) setDeliveryAddressId(null);
      if (invoiceAddressId === addressId) setInvoiceAddressId(null);
    }
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 6) return phone;
    return `(${phone.slice(0, 3)}) *** ** ${phone.slice(-2)}`;
  };

  const maskCardNo = (cardNo) => {
    if (!cardNo || typeof cardNo !== "string") return "****";
    const digits = cardNo.replace(/\D/g, "");
    if (digits.length < 4) return "****";
    const last4 = digits.slice(-4);
    const first4 = digits.length >= 8 ? digits.slice(0, 4) + " " : "";
    return `${first4}**** **** ${last4}`;
  };

  const deliveryAddress = addressList.find((a) => a.id === deliveryAddressId);

  const openAddCardForm = () => {
    setEditingCard(null);
    setCardForm(emptyCardForm);
    setShowCardForm(true);
  };

  const openEditCardForm = (card) => {
    setEditingCard(card);
    setCardForm({
      card_no: card.card_no || "",
      expire_month: card.expire_month != null ? String(card.expire_month) : "",
      expire_year: card.expire_year != null ? String(card.expire_year) : "",
      name_on_card: card.name_on_card || "",
    });
    setShowCardForm(true);
  };

  const closeCardForm = () => {
    setShowCardForm(false);
    setEditingCard(null);
    setCardForm(emptyCardForm);
  };

  const handleCardFormChange = (e) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCard = (e) => {
    e.preventDefault();
    const payload = {
      card_no: cardForm.card_no.replace(/\s/g, ""),
      expire_month: Number(cardForm.expire_month),
      expire_year: Number(cardForm.expire_year),
      name_on_card: cardForm.name_on_card.trim(),
    };
    if (editingCard && editingCard.id != null) {
      dispatch(updateCardThunk({ ...payload, id: String(editingCard.id) })).then(closeCardForm);
    } else {
      dispatch(addCardThunk(payload)).then(closeCardForm);
    }
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm("Bu kartı silmek istediğinize emin misiniz?")) {
      dispatch(deleteCardThunk(cardId));
      if (selectedCardId === cardId) setSelectedCardId(null);
    }
  };

  const selectedCard = selectedCardId
    ? creditCards.find((c) => String(c.id) === String(selectedCardId))
    : null;

  const handlePayment = () => {
    if (!deliveryAddressId) {
      toast.warning("Lütfen teslimat adresi seçin.");
      return;
    }
    if (!selectedCard) {
      toast.warning("Lütfen bir ödeme kartı seçin.");
      return;
    }
    const cvvNum = cardCvv.trim().replace(/\D/g, "");
    if (!cvvNum || cvvNum.length < 3) {
      toast.warning("Lütfen kart CVV girin.");
      return;
    }
    if (!agreementChecked) {
      toast.warning("Lütfen sözleşmeyi onaylayın.");
      return;
    }
    const checkedItems = cart.filter((item) => item.checked && item.product);
    if (checkedItems.length === 0) {
      toast.warning("Sepetinizde seçili ürün bulunmuyor.");
      return;
    }
    const cardNoDigits = String(selectedCard.card_no || "").replace(/\D/g, "");
    if (cardNoDigits.length < 12) {
      toast.warning("Seçili kart numarası eksik veya maskeli. Lütfen kartı düzenleyin veya yeni kart ekleyin.");
      return;
    }
    setOrderSubmitting(true);
    const payload = {
      address_id: Number(deliveryAddressId),
      order_date: new Date().toISOString().slice(0, 19),
      card_no: Number(cardNoDigits),
      card_name: selectedCard.name_on_card || "",
      card_expire_month: Number(selectedCard.expire_month),
      card_expire_year: Number(selectedCard.expire_year),
      card_ccv: Number(cvvNum) || 0,
      price: Number(Number(grandTotal).toFixed(2)),
      products: checkedItems.map((item) => ({
        product_id: Number(item.product.id),
        count: item.count,
        detail: "Tek Ebat",
      })),
    };
    dispatch(createOrderThunk(payload))
      .then(() => {
        toast.success("Siparişiniz alındı! Tebrikler.");
        history.push("/");
      })
      .catch(() => {
        toast.error("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
      })
      .finally(() => {
        setOrderSubmitting(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Siparişi Tamamla</h1>

      {/* Step indicators */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </span>
          <span className={step >= 1 ? "font-medium text-gray-900" : "text-gray-500"}>
            Adres Bilgileri
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </span>
          <span className={step >= 2 ? "font-medium text-gray-900" : "text-gray-500"}>
            Ödeme Seçenekleri
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Step content */}
        <div className="flex-1 min-w-0 space-y-6">
          {step === 1 && (
          <>
          {/* Step 1: Teslimat Adresi */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Teslimat Adresi</h2>

            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 mb-4"
            >
              <Plus className="w-5 h-5" />
              Yeni Adres Ekle
            </button>

            {showForm && (
              <form
                onSubmit={handleSubmitAddress}
                className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
              >
                <h3 className="font-medium text-gray-900">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres"}
                </h3>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Adres başlığı (örn. Ev, İş)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Ad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={handleFormChange}
                    placeholder="Soyad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Telefon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">İl</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  >
                    <option value="">Şehir seçin</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c.toLowerCase()}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleFormChange}
                  placeholder="İlçe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Mahalle / Adres (Sokak, bina, kapı numarası)
                  </label>
                  <textarea
                    name="neighborhood"
                    value={form.neighborhood}
                    onChange={handleFormChange}
                    placeholder="Mahalle, sokak, bina ve kapı numarası"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
                  >
                    {editingAddress ? "Güncelle" : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}

            <ul className="space-y-3">
              {addressList.map((addr) => (
                <li
                  key={addr.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg"
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={deliveryAddressId === addr.id}
                    onChange={() => setDeliveryAddressId(addr.id)}
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{addr.title}</p>
                    <p className="text-sm text-gray-500">
                      {addr.name} {addr.surname} · {maskPhone(addr.phone)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {addr.neighborhood}, {addr.district}, {addr.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(addr)}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <label className="mt-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={invoiceSameAsDelivery}
                onChange={(e) => setInvoiceSameAsDelivery(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500"
              />
              <span className="text-sm text-gray-700">
                Faturamı Aynı Adrese Gönder
              </span>
            </label>
            {!invoiceSameAsDelivery && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Fatura Adresi</p>
                {addressList.map((addr) => (
                  <label key={addr.id} className="flex items-center gap-2 py-1">
                    <input
                      type="radio"
                      name="invoiceAddress"
                      checked={invoiceAddressId === addr.id}
                      onChange={() => setInvoiceAddressId(addr.id)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm">{addr.title}</span>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">
              Kurumsal faturalı alışveriş için &quot;Faturamı Aynı Adrese Gönder&quot;
              tikini kaldırıp Fatura adresi olarak kayıtlı adresinizi seçebilirsiniz.
            </p>
          </section>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500"
            />
            <span className="text-sm text-gray-600">
              Ön Bilgilendirme Koşullarını ve Mesafeli Satış Sözleşmesini okudum,
              onaylıyorum.
            </span>
          </label>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full md:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium text-sm rounded-lg hover:bg-orange-600"
          >
            Kaydet ve Devam Et
          </button>
          </>
          )}

          {step === 2 && (
          <>
          {/* Address summary */}
          {deliveryAddress && (
            <section className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">Adres Bilgileri</h2>
                  <p className="text-sm font-medium text-gray-700">{deliveryAddress.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {deliveryAddress.neighborhood}, {deliveryAddress.district}, {deliveryAddress.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-orange-600 hover:underline whitespace-nowrap"
                >
                  Değiştir
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Ödeme Seçenekleri */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Ödeme Seçenekleri</h2>
            <p className="text-sm text-gray-500 mb-4">
              Banka/Kredi Kartı veya Alışveriş Kredisi ile ödemenizi güvenle yapabilirsiniz.
            </p>

            <div className="flex items-start gap-3 mb-4">
              <input
                type="radio"
                id="pay-card"
                name="paymentMethod"
                checked
                readOnly
                className="mt-1 w-4 h-4 text-orange-500"
              />
              <label htmlFor="pay-card" className="flex-1">
                <span className="font-medium text-gray-900">Kart ile Öde</span>
                <p className="text-sm text-gray-500 mt-0.5">
                  Banka veya Kredi Kartı kullanarak ödemenizi güvenle yapabilirsiniz.
                </p>
              </label>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Kart Bilgileri</h3>
            <button
              type="button"
              onClick={openAddCardForm}
              className="text-sm text-orange-600 hover:underline mb-4"
            >
              Başka bir Kart ile Ödeme Yap
            </button>

            {showCardForm && (
              <form
                onSubmit={handleSubmitCard}
                className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
              >
                <h4 className="font-medium text-gray-900">
                  {editingCard ? "Kartı Düzenle" : "Yeni Kart Ekle"}
                </h4>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kart Numarası</label>
                  <input
                    type="text"
                    name="card_no"
                    value={cardForm.card_no}
                    onChange={handleCardFormChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    name="name_on_card"
                    value={cardForm.name_on_card}
                    onChange={handleCardFormChange}
                    placeholder="Ad Soyad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Son Kullanma (Ay)</label>
                    <select
                      name="expire_month"
                      value={cardForm.expire_month}
                      onChange={handleCardFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    >
                      <option value="">Ay</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Yıl</label>
                    <select
                      name="expire_year"
                      value={cardForm.expire_year}
                      onChange={handleCardFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    >
                      <option value="">Yıl</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
                  >
                    {editingCard ? "Güncelle" : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={closeCardForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}

            <ul className="space-y-3">
              {creditCards.map((card) => (
                <li
                  key={card.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg ${
                    selectedCardId === card.id ? "border-orange-500 bg-orange-50/30" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="savedCard"
                    checked={selectedCardId === card.id}
                    onChange={() => setSelectedCardId(card.id)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {card.name_on_card || "Kartım"}
                    </p>
                    <p className="text-sm text-gray-500 font-mono">
                      {maskCardNo(card.card_no)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {card.expire_month}/{card.expire_year}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditCardForm(card)}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {selectedCard && (
              <div className="mt-4 max-w-xs">
                <label className="block text-xs text-gray-500 mb-1">CVV</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="4"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                  placeholder="3 veya 4 rakam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}

            <label className="mt-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={use3DSecure}
                onChange={(e) => setUse3DSecure(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500"
              />
              <span className="text-sm text-gray-700">3D Secure ile ödemek istiyorum.</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Ödeme seçenekleri kart verisine göre getirilir.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Taksit Seçenekleri</h4>
              <p className="text-xs text-gray-500 mb-2">Kartınıza uygun taksit seçeneğini seçiniz.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2">Taksit Sayısı</th>
                    <th className="py-2 text-right">Aylık Ödeme</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Tek Çekim</td>
                    <td className="py-2 text-right font-medium">
                      {formatPrice(selectedCount > 0 ? grandTotal : 0)} TL
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500"
            />
            <span className="text-sm text-gray-600">
              Ön Bilgilendirme Koşullarını ve Mesafeli Satış Sözleşmesini okudum, onaylıyorum.
            </span>
          </label>

          <button
            type="button"
            onClick={handlePayment}
            disabled={orderSubmitting}
            className="w-full md:w-auto px-6 py-2.5 bg-gray-800 text-white font-medium text-sm rounded-lg hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {orderSubmitting ? "İşleniyor..." : "Ödeme Yap"}
          </button>
          </>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-4 bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Ürünün Toplamı</dt>
                <dd className="font-medium text-gray-900">{formatPrice(selectedTotal)} TL</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Kargo Toplam</dt>
                <dd className="font-medium text-gray-900">
                  {formatPrice(selectedCount > 0 ? SHIPPING_PRICE : 0)} TL
                </dd>
              </div>
              {shippingDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>{FREE_SHIPPING_THRESHOLD} TL ve Üzeri Kargo Bedava</dt>
                  <dd className="font-medium">-{formatPrice(shippingDiscount)} TL</dd>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <dt className="font-semibold text-gray-900">Toplam</dt>
                <dd className="font-semibold text-gray-900">
                  {formatPrice(selectedCount > 0 ? grandTotal : 0)} TL
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
