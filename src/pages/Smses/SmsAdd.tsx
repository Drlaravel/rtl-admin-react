import React, { useState, useEffect, useCallback } from 'react';

import api from '../../api/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const SmsAdd: React.FC = () => {
  const navigate = useNavigate();

  // State variables
  const [usersSelection, setUsersSelection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; name: string }[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<{ id: number; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ id: number; name: string } | null>(null);
  const [message, setMessage] = useState<string>('');

  // Fetch users and projects data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
            api.get('/api/sms/users'),
            api.get('/api/sms/projects'),
        ]);

        setUsers(usersResponse.data.data);
        setProjects(projectsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        MySwal.fire('خطا!', 'دریافت یوزرها و پروژه با مشکل مواجه شد.', 'error');
      }
    };
    fetchData();
  }, []);

  // Filter users or projects based on search query
  useEffect(() => {
    if (usersSelection === 'specific_users') {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else if (usersSelection === 'projects') {
      setFilteredProjects(
        projects.filter((project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, usersSelection, users, projects]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prepare data to send
      const data: any = {
        users_selection: usersSelection,
        message: message,
      };

      if (usersSelection === 'specific_users' && selectedUser) {
        data.user_id = selectedUser.id;
      } else if (usersSelection === 'projects' && selectedProject) {
        data.project_id = selectedProject.id;
      }

      try {
        await api.post('/api/sms/send', data);
        MySwal.fire('موفقیت', 'پیامک با موفقیت ارسال شد.', 'success');
        navigate('/sms/logs'); // Redirect to SMS logs or any desired route
      } catch (error) {
        console.error('Error sending SMS:', error);
        MySwal.fire('خطا!', 'ارسال پیامک با مشکل مواجه شد.', 'error');
      }
    },
    [usersSelection, message, selectedUser, selectedProject, navigate]
  );

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb pageName="ارسال پیامک به کاربران" />

      <div className="container">
        <div className="mt-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <form onSubmit={handleSubmit}>
            <div>
              {/* Users Selection */}
              <div className="mb-5">
                <label
                  htmlFor="users_selection"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  ارسال پیامک بر اساس:
                </label>
                <select
                  value={usersSelection}
                  onChange={(e) => {
                    setUsersSelection(e.target.value);
                    setSearchQuery('');
                    setSelectedUser(null);
                    setSelectedProject(null);
                  }}
                  name="users_selection"
                  id="users_selection"
                  className="w-full rounded-sm border border-stroke bg-white py-3 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                >
                  <option value="all">همه کاربران</option>
                  <option value="specific_users">کاربران خاص</option>
                  <option value="projects">پروژه‌ها</option>
                </select>
              </div>

              {/* Specific Users Selection */}
              {usersSelection === 'specific_users' && (
                <div className="mb-5">
                  <label
                    htmlFor="user_search"
                    className="mb-2.5 block font-medium text-black dark:text-white"
                  >
                    نام کاربر
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="نام کاربر را جستجو کنید"
                    className="w-full rounded-sm border border-stroke bg-white py-3 px-4.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                  />
                  {filteredUsers.length > 0 && (
                    <ul className="mt-2 max-h-48 overflow-auto bg-white border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark">
                      {filteredUsers.map((user) => (
                        <li
                          key={user.id}
                          onClick={() => {
                            setSelectedUser(user);
                            setSearchQuery(user.name);
                            setFilteredUsers([]);
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {user.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Projects Selection */}
              {usersSelection === 'projects' && (
                <div className="mb-5">
                  <label
                    htmlFor="project_search"
                    className="mb-2.5 block font-medium text-black dark:text-white"
                  >
                    نام پروژه
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="نام پروژه را جستجو کنید"
                    className="w-full rounded-sm border border-stroke bg-white py-3 px-4.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark"
                  />
                  {filteredProjects.length > 0 && (
                    <ul className="mt-2 max-h-48 overflow-auto bg-white border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark">
                      {filteredProjects.map((project) => (
                        <li
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setSearchQuery(project.name);
                            setFilteredProjects([]);
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {project.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Message Textarea */}
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  پیام:
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-sm border border-stroke bg-white py-3 px-4.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                  rows={5}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4.5 font-medium text-white"
              >
                ارسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SmsAdd;
