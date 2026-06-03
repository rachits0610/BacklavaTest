export const endpoints = {
  admin: {
    login: 'Api/admin/admin-login',
    forgetPassword: 'Api/admin/forget-password',
    varifyOTP: 'Api/admin/verify-otp',
    resetPassword: 'Api/admin/reset-password',
    changePassword: 'Api/admin/change-password',
    addNewAdmin: 'Api/admin/create-admin',

    category: {
      createUpdateCategory: 'Api/AdminCategory/create-update-category',
      getAllCategories: 'Api/AdminCategory/get-all-categories',
      getCategoryById: 'Api/AdminCategory/get-category-by-id',
      deleteCategory: 'Api/AdminCategory/delete-category',
    },
  },

  //sub - category endpoints
  createUpdateSubCategory: 'Api/AdminSubCategory/create-update-subCategory',
  getAllSubCategories: 'Api/AdminSubCategory/get-all-subCategories',
  getSubCategoryById: 'Api/AdminSubCategory/get-subCategory',
  deleteSubCategory: 'Api/AdminSubCategory/delete-subCategory',
  //product - endpoints
  addUpdateProduct: 'Api/AdminProducts/create-update-product',
  allProductsList: 'Api/AdminProducts/get-all-products',
  deleteProductById: 'Api/AdminProducts/delete-product',
  getProductById: 'Api/AdminProducts/get-product-by-id',

  //Users
  allUsersList: 'Api/AdminUsers/get-all-users',
  createUser: 'Api/AdminUsers/create-user',
  updateUserByUserId: 'Api/AdminUsers/update-user',
  deleteCustomer: 'Api/AdminUsers/delete-user',

  //all orders
  allOrders: 'Api/AdminOrder/get-all-orders',

  //DashBoard Data
  getDashboardData: 'Api/AdminDashboard/get-admin-dashboard-data',

  //payments
  getAllPayments: 'Api/Admin/payment-records',

  //ddls
  categoryDDl: 'Api/AdminDropdown/dropdown-category',
  subCategoryDDl: 'Api/AdminDropdown/dropdown-subCategory',
  getOrderStatusDDl: 'Api/AdminDropdown/get-order-status-ddl',
  paymentStatusDdl: 'Api/AdminDropdown/get-payment-status-ddl',
};
