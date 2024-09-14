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
import Select, { StylesConfig, InputActionMeta } from 'react-select';

const MySwal = withReactContent(Swal);

const customStyles: StylesConfig<any, false> = {
  control: (provided) => ({
    ...provided,
    borderColor: 'rgb(61 77 95)', // تغییر رنگ مرزی
    borderWidth: '1.5px', // تغییر ضخامت مرزی
    borderRadius: '5px', // تنظیم گردی حاشیه
    padding: '0.5rem', // تغییر فاصله داخلی
    backgroundColor: 'transparent', // پس‌زمینه شفاف
    color: '#ffffff', // رنگ نوشته
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#2563eb' : 'white', // رنگ پس‌زمینه برای گزینه‌های انتخابی
    color: state.isFocused ? 'white' : '#0062ff', // رنگ نوشته برای گزینه‌های انتخابی
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ffffff', // رنگ placeholder
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff', // تغییر رنگ متن به سفید
  }),
};


interface DomainFormData {
  name: string;
  expiry_date: string;
  reminder_date: string;
  purchase_type: 'ours' | 'customer';
  reminder: '0' | '1'; // Active (0) or Inactive (1)
  price: number;
  associated_with: 'project' | 'user' | '';
  project_id: number | null;
  user_id: number | null;
}

interface OptionType {
  value: string | number;
  label: string;
}

const DomainAdd: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<DomainFormData>({
    defaultValues: {
      name: '',
      expiry_date: '',
      reminder_date: '',
      purchase_type: 'ours',
      reminder: '0',
      associated_with: '',
      project_id: null,
      user_id: null,
    }
  });

  const [users, setUsers] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<OptionType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<OptionType[]>([]);

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  const onSubmit = async (data: DomainFormData) => {
    try {
      await api.post('/api/domains', data);
      showAlert('موفقیت', 'دامنه با موفقیت ایجاد شد.', 'success');
      reset();
      navigate('/domains/list');
    } catch (error) {
      console.error('Error creating domain:', error);
      showAlert('خطا!', 'ایجاد دامنه با مشکل مواجه شد.', 'error');
    }
  };

  // Fetch all users and projects once
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

  // Filter functions
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

  useEffect(() => {
    if (associatedWith === 'project') {
      setValue('user_id', null);
    } else if (associatedWith === 'user') {
      setValue('project_id', null);
    }
  }, [associatedWith, setValue]);

  return (
    <>
      <Breadcrumb pageName="ایجاد دامنه جدید" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">ایجاد دامنه جدید</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Domain Information */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">نام دامنه</label>
              <input
                type="text"
                {...register('name', { required: 'نام دامنه الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                placeholder="نام دامنه"
              />
              {errors.name && <p className="text-danger text-3 mt-2.5">{errors.name.message}</p>}
            </div>

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">هزینه دامنه</label>
              <input
                type="text"
                {...register('price', { required: 'هزینه دامنه الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                placeholder="هزینه دامنه"
              />
              {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
            </div>

            </div>
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
            
            {/* Expiry Date */}
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

            {/* Reminder Date */}
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
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
           
            {/* Purchase Type */}
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

            {/* Reminder Status */}
            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">یادآور</label>
              <select
                {...register('reminder', { required: 'وضعیت یادآور الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder ? 'border-red-500' : 'border-stroke'}`}
              >
                <option value="0">فعال</option>
                <option value="1">غیرفعال</option>
              </select>
              {errors.reminder && <p className="text-danger text-3 mt-2.5">{errors.reminder.message}</p>}
            </div>
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

            <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
              ایجاد دامنه
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DomainAdd;