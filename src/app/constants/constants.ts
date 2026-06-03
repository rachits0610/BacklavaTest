export const GUEST_ID = 'GUEST_ID';
export const GUEST_CART_ID = 'GUEST_CART_ID';
export const TOKEN = 'TOKEN';
export const ADMIN_TOKEN = 'ADMIN_TOKEN';
export const TEMP_TOKEN = 'TEMP_TOKEN';
export const REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE';
export const USER_ID = 'USER_ID';
export const EMOJI =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
export const EMAIL_REGEX = /^[\w.]+@(\w+\.)+\w{2,4}$/i;
export const OTP_REGEX = /^\d{6}$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const LANDLINE_REGEX = /^\+?\d{0,4}[- ]?\d{10}$|^\d{5}[- ]?\d{6}$/;
export const WEBSITE_REGEX =
  /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-z0-9]+\/?)*$/i;
export const PANNO_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/i;
export const GSTNO_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
export const AADHAR_REGEX = /^[2-9]\d{3}\d{4}\d{4}$/i;
export const NUM_REGEX = /^\d*$/im;
export const POSTALCODE_REGEX = /^(\d{4}|\d{6})$/;
export const NAME_REGEX = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}/;
export const SIGNUP_MOBILE = 'SIGNUP_MOBILE';
export const SIGNUP_EMAIL = 'SIGNUP_EMAIL';
export const STATUS_MAP = {
  Pending: 'Pending',
  1: 'Accepted',
  2: 'Accepted',
  3: 'Accepted',
  5: 'Delivered',
  4: 'Dispatched',
  6: 'Cancelled',
  7: 'Waiting for payment confirmation',
};

export const STATUS_CLASS_MAP = {
  Idle: 'sAccepted',
  Pending: 'sPending',
  Accepted: 'sAccepted',
  'In-process': 'sAccepted',
  Delivered: 'sDelivered',
  Dispatched: 'sDispatched',
  Cancelled: 'sCanceled',
};

export const ORDER_CLASS_MAP = {
  2: 'badge badge-pill badge-soft-warning font-size-12 waves-effect',
  Pending: 'badge badge-pill badge-soft-warning font-size-12 waves-effect',
  1: 'badge badge-pill badge-soft-secondary font-size-12 waves-effect',
  3: 'badge badge-pill badge-soft-primary font-size-12 waves-effect',
  5: 'badge badge-pill badge-soft-success font-size-12 waves-effect',
  4: 'badge badge-pill badge-soft-purple font-size-12 waves-effect',
  6: 'badge badge-pill badge-soft-danger font-size-12 waves-effect',
  7: 'badge badge-pill badge-soft-info font-size-12 waves-effect',
  8: 'badge badge-pill badge-soft-info font-size-12 waves-effect',
};

export const ORDER_STATUS_CLASS_MAP = {
  'In-process': 'badge badge-pill badge-soft-warning font-size-12 ms-lg-2',
  Pending: 'badge badge-pill badge-soft-warning font-size-12 waves-effect',
  Idle: 'badge badge-pill badge-soft-secondary font-size-12 ms-lg-2',
  Accepted: 'badge badge-pill badge-soft-primary font-size-12 ms-lg-2',
  Delivered: 'badge badge-pill badge-soft-success font-size-12 ms-lg-2',
  Dispatched: 'badge badge-pill badge-soft-purple font-size-12 ms-lg-2',
  Cancelled: 'badge badge-pill badge-soft-danger font-size-12 ms-lg-2',
};

export const ORDER_STATUS_IMAGE_CLASS_MAP = {
  1: 'idle',
  2: 'idle',
  3: 'idle',
  4: 'dispatched',
  5: 'delivered',
  6: 'cancelled',
  7: 'Waiting for payment confirmation',
};

export const PAYMENT_STATUS_CLASS_MAP = {
  Aborted: 'badge badge-pill badge-soft-warning font-size-12 waves-effect ',
  PENDING: 'badge badge-pill badge-soft-warning font-size-12 waves-effect ',
  SUCCESS: 'badge badge-pill badge-soft-success font-size-12 waves-effect',
  CANCELLED: 'badge badge-pill badge-soft-danger font-size-12 waves-effect',
  null: 'badge badge-pill badge-soft-info font-size-12 waves-effect',
};

export const LEVEL_LIST = [
  {
    id: 3,
    name: 'L6 Position',
    roleid: 3,
  },
  {
    id: 4,
    name: 'L5 Position',
    roleid: 4,
  },
  {
    id: 5,
    name: 'L4 Position',
    roleid: 5,
  },
  {
    id: 11,
    name: 'L3 Position',
    roleid: 11,
  },
  {
    id: 12,
    name: 'L2 Position',
    roleid: 12,
  },
  {
    id: 13,
    name: 'L1 Position',
    roleid: 13,
  },
];

export const MARKER_COLOR_IMAGE_OBJ: any = {
  0: {
    color: '#CC5500',
    image: 'blue_marker.svg',
    name: 'RetailingExample',
  },
  1: {
    color: '#74C0FC',
    image: 'blue_marker.svg',
    name: 'RetailingExample',
  },
  2: {
    color: '#63E6BE',
    image: 'green_marker.svg',
    name: 'RetailingExample',
  },
  3: {
    color: '#B197FC',
    image: 'purple_marker.svg',
    name: 'RetailingExample',
  },
  4: {
    color: ' #DA58D8',
    image: 'pink_marker.svg',
    name: 'RetailingExample',
  },
  5: {
    color: '#FB6060',
    image: 'red_marker.svg',
    name: 'RetailingExample',
  },
  6: {
    color: '#FACC15',
    image: 'yellow_marker.svg',
    name: 'RetailingExample',
  },
  8: {
    color: '#000000',
    image: 'black_marker.svg',
    name: 'RetailingExample',
  },
};

export enum tableColumnId {
  CheckBox = 0,
  Image = 1,
  EditAllowed = 2,
  AlignCenter = 3,
  Other = 4,
  Status = 5,
}
