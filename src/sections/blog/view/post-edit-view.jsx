import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostNewEditForm } from '../post-new-edit-form';

// ----------------------------------------------------------------------

export function PostEditView({ post }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ویرایش"
        links={[
          { name: 'داشبورد', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: post?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostNewEditForm currentPost={post} />
    </DashboardContent>
  );
}
