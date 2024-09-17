import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const MySwal = withReactContent(Swal);

interface SmsSettingsFormData {
  sms_username: string;
  sms_password: string;
  sms_api_key: string;
  sms_line_number: string;
  sms_enabled: boolean;
}

const SmsSettings: React.FC = () => {
  const [settings, setSettings] = useState<SmsSettingsFormData>({
    sms_username: '',
    sms_password: '',
    sms_api_key: '',
    sms_line_number: '',
    sms_enabled: false,
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SmsSettingsFormData>();

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/sms/settings');
        setSettings(response.data.data);
        Object.entries(response.data.data).forEach(([key, value]) => setValue(key as keyof SmsSettingsFormData, value));
      } catch (error) {
        console.error('Error fetching SMS settings:', error);
        showAlert('خطا!', 'دریافت تنظیمات SMS با مشکل مواجه شد.', 'error');
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: SmsSettingsFormData) => {
    // Convert sms_enabled to boolean
    const updatedData = {
      ...data,
      sms_enabled: data.sms_enabled === 'true', // Convert string to boolean
    };

    try {
      await api.post('/api/sms/settings', updatedData);
      showAlert('موفقیت', 'تنظیمات با موفقیت ذخیره شد.', 'success');
    } catch (error) {
      console.error('Error saving SMS settings:', error);
      showAlert('خطا!', 'ذخیره تنظیمات با مشکل مواجه شد.', 'error');
    }
  };

  return (
    <>
      <Breadcrumb pageName="تنظیمات SMS" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">تنظیمات SMS</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SMS Username */}
              <div className="mb-5">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="sms_username">SMS Username</label>
                <input
                  type="text"
                  id="sms_username"
                  {...register('sms_username', { required: 'نام کاربری SMS الزامی است.' })}
                  className={`w-full rounded-sm border ${errors.sms_username ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-4.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  defaultValue={settings.sms_username}
                />
                {errors.sms_username && <p className="text-danger text-3 mt-2.5">{errors.sms_username.message}</p>}
              </div>

              {/* SMS Password */}
              <div className="mb-5">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="sms_password">SMS Password</label>
                <input
                  type="text"
                  id="sms_password"
                  {...register('sms_password', { required: 'رمز عبور SMS الزامی است.' })}
                  className={`w-full rounded-sm border ${errors.sms_password ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-4.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  defaultValue={settings.sms_password}
                />
                {errors.sms_password && <p className="text-danger text-3 mt-2.5">{errors.sms_password.message}</p>}
              </div>

              {/* SMS API Key */}
              <div className="mb-5">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="sms_api_key">SMS API Key</label>
                <input
                  type="text"
                  id="sms_api_key"
                  {...register('sms_api_key', { required: 'کلید API SMS الزامی است.' })}
                  className={`w-full rounded-sm border ${errors.sms_api_key ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-4.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  defaultValue={settings.sms_api_key}
                />
                {errors.sms_api_key && <p className="text-danger text-3 mt-2.5">{errors.sms_api_key.message}</p>}
              </div>

              {/* SMS Line Number */}
              <div className="mb-5">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="sms_line_number">SMS Line Number</label>
                <input
                  type="text"
                  id="sms_line_number"
                  {...register('sms_line_number', { required: 'شماره خط SMS الزامی است.' })}
                  className={`w-full rounded-sm border ${errors.sms_line_number ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-4.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  defaultValue={settings.sms_line_number}
                />
                {errors.sms_line_number && <p className="text-danger text-3 mt-2.5">{errors.sms_line_number.message}</p>}
              </div>

              {/* SMS Enabled */}
              <div className="mb-5">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="sms_enabled">وضعیت سامانه پیامکی</label>
                <select
                  id="sms_enabled"
                  {...register('sms_enabled')}
                  className="w-full rounded-sm border border-stroke bg-transparent py-3 focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                  defaultValue={settings.sms_enabled ? 'true' : 'false'}
                >
                  <option value="true">فعال</option>
                  <option value="false">غیرفعال</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
              ذخیره تنظیمات
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SmsSettings;
