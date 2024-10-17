import React, { useState, useEffect } from 'react';

const FormattedNumberInput = ({
  register,
  setValue,
  getValues,
  name,
  label,
  errors,
  placeholder,
  validation = {},
  className = '',
  defaultValue = '', // مقدار پیش‌فرض (برای تنظیم مقدار اولیه)
}) => {
  const [rawValue, setRawValue] = useState(''); // مقدار خام ورودی
  const [formattedValue, setFormattedValue] = useState(''); // مقدار فرمت‌شده برای نمایش

  // تابع برای فرمت کردن عدد به تومان و جدا کردن اعداد به سه‌رقمی
  const formatNumber = (num) => {
    if (num === '') return '';
    const formattedNumber = num.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // جدا کردن اعداد
    return formattedNumber; // فقط عدد فرمت‌شده را برمی‌گرداند
  };

  // مدیریت تغییرات ورودی
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // فقط عدد نگه‌داریم
    setRawValue(value); // مقدار خام را به‌روز می‌کنیم
    setFormattedValue(formatNumber(value)); // مقدار فرمت‌شده را به‌روز می‌کنیم
    setValue(name, value ? parseInt(value, 10) : '', { shouldValidate: true }); // مقدار خام را به فرم می‌دهیم
  };

  // مدیریت فرمت ورودی در هنگام از دست دادن فوکوس
  const handleBlur = () => {
    setFormattedValue(formatNumber(rawValue)); // مقدار فرمت‌شده را در هنگام از دست دادن فوکوس نمایش می‌دهیم
  };

  // مدیریت بازگشت مقدار به حالت خام در هنگام فوکوس روی ورودی
  const handleFocus = () => {
    setFormattedValue(rawValue); // مقدار خام را در هنگام فوکوس نمایش می‌دهیم
  };

  // مقداردهی اولیه برای مقدارهای موجود در فرم
  useEffect(() => {
    if (typeof register === 'function') {
      register(name, validation);
    }

    const initialValue = getValues?.(name) || defaultValue; // گرفتن مقدار اولیه (اگر وجود دارد)
    if (initialValue) {
      setRawValue(initialValue.toString()); // مقدار اولیه را در حالت خام قرار می‌دهیم
      setFormattedValue(formatNumber(initialValue.toString())); // مقدار اولیه را فرمت‌شده نمایش می‌دهیم
    }
  }, [register, name, validation, getValues, defaultValue]);

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="mb-2.5 block text-black dark:text-white">{label}</label>}
      <input
        type="text"
        inputMode="numeric"
        value={formattedValue} // مقدار فرمت‌شده را نمایش می‌دهیم
        onChange={handleChange} // تغییرات ورودی
        onBlur={handleBlur}     // فرمت در هنگام از دست دادن فوکوس
        onFocus={handleFocus}   // نمایش مقدار خام در هنگام فوکوس
        className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.[name] ? 'border-red-500' : 'border-stroke dark:border-form-strokedark'}`}
        placeholder={placeholder}
      />
      {errors?.[name] && <p className="text-danger text-3 mt-2.5">{errors[name].message}</p>}
    </div>
  );
};

export default FormattedNumberInput;
