import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';

const MySwal = withReactContent(Swal);

const customStyles: StylesConfig<any, false> = {
  control: (provided) => ({
    ...provided,
    borderColor: 'rgb(61 77 95)',
    borderWidth: '1.5px',
    borderRadius: '5px',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#2563eb' : 'white',
    color: state.isFocused ? 'white' : '#0062ff',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
};

interface HostFormData {
  username: string;
  password: string;
  link: string;
  expiry_date: string;
  reminder_date: string;
  space: string;
  company_name: string;
  price: number;
  purchase_type: 'ours' | 'customer';
  reminder: string;
  associated_with: 'project' | 'user' | '';
  project_id: number | null;
  user_id: number | null;
  shouldCreateInvoice: boolean;
}

interface OptionType {
  value: string | number;
  label: string;
}

const HostAdd: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<HostFormData>({
    defaultValues: {
      username: '',
      password: '',
      link: '',
      expiry_date: '',
      reminder_date: '',
      space: '',
      company_name: '',
      price: 0,
      purchase_type: 'ours',
      reminder: '0',
      associated_with: '',
      project_id: null,
      user_id: null,
      shouldCreateInvoice: false,
    }
  });

  const [users, setUsers] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<OptionType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<OptionType[]>([]);

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  const onSubmit = async (data: HostFormData) => {
    try {
      await api.post('/api/hosts', data);
      showAlert('موفقیت', 'هاست با موفقیت ایجاد شد.', 'success');
      reset();
      navigate('/hosts/list');
    } catch (error) {
      console.error('Error creating host:', error);
      showAlert('خطا!', 'ایجاد هاست با مشکل مواجه شد.', 'error');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/projects'),
        ]);

        const usersData = usersResponse.data.data.map((user: any) => ({
          value: user.id,
          label: user.name,
        }));

        const projectsData = projectsResponse.data.data.map((project: any) => ({
          value: project.id,
          label: project.name,
        }));

        setUsers(usersData);
        setProjects(projectsData);
        setFilteredUsers(usersData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('خطا!', 'دریافت داده‌ها با مشکل مواجه شد.', 'error');
      }
    };

    fetchAllData();
  }, []);

  const handleUserInputChange = (inputValue: string) => {
    const filtered = users.filter(user =>
      user.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleProjectInputChange = (inputValue: string) => {
    const filtered = projects.filter(project =>
      project.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const associatedWith = watch('associated_with');
  const purchaseType = watch('purchase_type'); // برای مشاهده تغییرات نوع خرید

  useEffect(() => {
    if (associatedWith === 'project') {
      setValue('user_id', null);
    } else if (associatedWith === 'user') {
      setValue('project_id', null);
    }
  }, [associatedWith, setValue]);

  return (
    <>
      <Breadcrumb pageName="ایجاد هاست جدید" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">ایجاد هاست جدید</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Host Information */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نام کاربری</label>
                <input
                  type="text"
                  {...register('username', { required: 'نام کاربری الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.username ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="نام کاربری"
                />
                {errors.username && <p className="text-danger text-3 mt-2.5">{errors.username.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">رمز عبور</label>
                <input
                  type="password"
                  {...register('password', { required: 'رمز عبور الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="رمز عبور"
                />
                {errors.password && <p className="text-danger text-3 mt-2.5">{errors.password.message}</p>}
              </div>
            </div>

            {/* Host Link and Space */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">لینک هاست</label>
                <input
                  type="text"
                  {...register('link', { required: 'لینک هاست الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.link ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="لینک هاست"
                />
                {errors.link && <p className="text-danger text-3 mt-2.5">{errors.link.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">فضای هاست</label>
                <input
                  type="text"
                  {...register('space', { required: 'فضای هاست الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.space ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="فضای هاست"
                />
                {errors.space && <p className="text-danger text-3 mt-2.5">{errors.space.message}</p>}
              </div>
            </div>

            {/* Dates and Price */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ انقضا</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ انقضا"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  onChange={(date) => setValue('expiry_date', date?.format() || '')}
                />
                {errors.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.expiry_date.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ یادآوری</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ یادآوری"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  onChange={(date) => setValue('reminder_date', date?.format() || '')}
                />
                {errors.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.reminder_date.message}</p>}
              </div>
            </div>

            {/* Purchase Type and Reminder Status */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نوع خرید</label>
                <select
                  {...register('purchase_type', { required: 'نوع خرید الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.purchase_type ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="ours">خریداری شده توسط ما</option>
                  <option value="customer">خریداری شده توسط مشتری</option>
                </select>
                {errors.purchase_type && <p className="text-danger text-3 mt-2.5">{errors.purchase_type.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">یادآور</label>
                <select
                  {...register('reminder')}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="0">فعال</option>
                  <option value="1">غیرفعال</option>
                </select>
              </div>
            </div>

            {/* Show company_name only if purchase_type is "customer" */}
            {purchaseType === 'customer' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نام کمپانی</label>
                <input
                  type="text"
                  {...register('company_name')}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.company_name ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="نام کمپانی"
                />
              </div>
            )}

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">قیمت هاست</label>
              <input
                type="text"
                {...register('price')}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                placeholder="قیمت هاست"
              />
              {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
            </div>

            {/* Associate With: Project or User */}
            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">اضافه کردن به:</label>
              <select
                {...register('associated_with', { required: 'این فیلد الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
              >
                <option value="">انتخاب کنید</option>
                <option value="project">پروژه</option>
                <option value="user">کاربر</option>
              </select>
            </div>

            {/* Select Project or User */}
            {associatedWith === 'project' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب پروژه</label>
                <Select
                  styles={customStyles}
                  options={filteredProjects}
                  onInputChange={handleProjectInputChange}
                  onChange={(selectedOption) => setValue('project_id', selectedOption ? selectedOption.value : null)}
                  placeholder="پروژه را انتخاب کنید"
                  isClearable
                />
              </div>
            )}

            {associatedWith === 'user' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب کاربر</label>
                <Select
                  styles={customStyles}
                  options={filteredUsers}
                  onInputChange={handleUserInputChange}
                  onChange={(selectedOption) => setValue('user_id', selectedOption ? selectedOption.value : null)}
                  placeholder="کاربر را انتخاب کنید"
                  isClearable
                />
              </div>
            )}

            {/* Create Invoice Checkbox */}
            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">ایجاد فاکتور</label>
              <input
                type="checkbox"
                {...register('shouldCreateInvoice')}
                className="w-4 h-4 text-primary border-stroke dark:border-form-strokedark dark:bg-form-input rounded"
              />
            </div>

            <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
              ایجاد هاست
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HostAdd;
