export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}
export interface CategoryApiResponse {
  meta: { status_code: number; status_message: string };
  data: {
    pageNo: number;
    noOfData: number;
    nextPageAvailable: boolean;
    list: {
      categoryId: number;
      categoryName: string;
      statusId: number;
      statusName: string;
    }[];
  };
}

export interface subCategoryresponse {
  meta: { status_code: number };
  data: {
    pageNo: number;
    noOfData: number;
    nextPageAvailable: boolean;
    list: {
      subCategoryId: number;
      subCategoryName: string;
      statusId: number;
      statusName: string;
    }[];
  };
}

export interface FilterValues {
  search: string;
  startDate: string;
  endDate: string;
  statusId: number | '';
}
export interface ContactedUser {
  name: string;
  email: string;
  phoneNumber: string;
  subjectId: number;
  subjectName: string;
  message: string;
  contactedUsAt: string;
}
export interface SubscribedUser {
  email: string;
  subscribedAt: string;
}

export interface Breadcrumb {
  label: string;
  url: string;
}
