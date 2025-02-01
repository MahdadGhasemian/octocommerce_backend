import { AccessInfoEndpoint } from '../entities';

export const InfoEndpointData: AccessInfoEndpoint[] = [
  {
    key: 'users_info',
    tag: 'اطلاعات کاربران',
    get: false,
    post: false,
    patch: false,
    delete: null,
  },
  {
    key: 'users_access',
    tag: 'تنظیمات سطح دسترسی کاربران',
    get: null,
    post: null,
    patch: false,
    delete: null,
  },
  {
    key: 'users_setting',
    tag: 'تنظیمات کاربران',
    get: null,
    post: null,
    patch: false,
    delete: null,
  },
  {
    key: 'accesses',
    tag: 'سطوح دسترسی',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'categories',
    tag: 'دسته بندی',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'packaging-costs',
    tag: 'هزینه های بسته بندی',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'delivery-methods',
    tag: 'روش های ارسال',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'products',
    tag: 'محصولات',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'reviews',
    tag: 'نظرات محصول',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'questions',
    tag: 'پرسش ها',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'answers',
    tag: 'پاسخ به پرسش',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'contacts',
    tag: 'مخاطب ها',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'orders',
    tag: 'پیش فاکتور',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'orders_delivery_add',
    tag: 'افزودن اطلاعات حمل پیش فاکتور',
    get: null,
    post: false,
    patch: null,
    delete: null,
  },
  {
    key: 'orders_approve',
    tag: 'تایید پیش فاکتور',
    get: false,
    post: false,
    patch: false,
    delete: null,
  },
  {
    key: 'orders_payment_approve',
    tag: 'تایید پرداخت های پیش فاکتور',
    get: false,
    post: null,
    patch: false,
    delete: null,
  },
  {
    key: 'orders_delivery_approve',
    tag: 'تایید اطلاعات حمل پیش فاکتور',
    get: false,
    post: null,
    patch: false,
    delete: null,
  },
  {
    key: 'orders_product_inventory',
    tag: 'اختصاص حواله کالا پیش فاکتور',
    get: false,
    post: false,
    patch: null,
    delete: null,
  },
  {
    key: 'warehouses',
    tag: 'انبار',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'inventories',
    tag: 'عملیات انبار',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'boards',
    tag: 'کارها',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'boards_tools',
    tag: 'لیست و برچسب ها  (کارها)',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'projects',
    tag: 'گروه های کاری',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'payments',
    tag: 'پرداخت ها',
    get: false,
    post: false,
    patch: null,
    delete: null,
  },
  {
    key: 'transactions',
    tag: 'تراکنش ها',
    get: false,
    post: null,
    patch: null,
    delete: null,
  },
  {
    key: 'bonuses',
    tag: 'پاداش خرید',
    get: false,
    post: false,
    patch: false,
    delete: false,
  },
  {
    key: 'settings',
    tag: 'تنظیمات سیستم',
    get: null,
    post: null,
    patch: false,
    delete: null,
  },
  {
    key: 'analytics',
    tag: 'داشبورد',
    get: false,
    post: null,
    patch: null,
    delete: null,
  },
  {
    key: 'storage',
    tag: 'فایل',
    get: false,
    post: false,
    patch: null,
    delete: null,
  },
];

export const EndpointData = [
  {
    key: 'users_info',
    get: ['/users', '/users/{id}'],
    post: ['/users'],
    patch: ['/users/{id}'],
    delete: [],
  },
  {
    key: 'users_access',
    get: [],
    post: [],
    patch: ['/users/{id}/access'],
    delete: [],
  },
  {
    key: 'users_setting',
    get: [],
    post: [],
    patch: ['/users/{id}/settings'],
    delete: [],
  },
  {
    key: 'accesses',
    get: ['/accesses', '/access/{id}'],
    post: ['/accesses/{id}'],
    patch: ['/accesses/{id}'],
    delete: ['/accesses/{id}'],
  },
  {
    key: 'categories',
    get: [
      '/categories',
      '/categories/{id}',
      '/categories/get/tree',
      '/categories/get/flat',
    ],
    post: ['/categories'],
    patch: ['/categories/{id}'],
    delete: ['/categories/{id}'],
  },
  {
    key: 'packaging-costs',
    get: ['/packaging-costs', '/packaging-costs/{id}'],
    post: ['/packaging-costs'],
    patch: ['/packaging-costs/{id}'],
    delete: ['/packaging-costs/{id}'],
  },
  {
    key: 'delivery-methods',
    get: ['/delivery-methods', '/delivery-methods/{id}'],
    post: ['/delivery-methods'],
    patch: ['/delivery-methods/{id}'],
    delete: ['/delivery-methods/{id}'],
  },
  {
    key: 'products',
    get: ['/products', '/products/{id}'],
    post: ['/products'],
    patch: ['/products/{id}'],
    delete: ['/products/{id}'],
  },
  {
    key: 'bonuses',
    get: ['/bonuses', '/bonuses/{id}'],
    post: ['/bonuses'],
    patch: ['/bonuses/{id}'],
    delete: ['/bonuses/{id}'],
  },
  {
    key: 'contacts',
    get: ['/contacts', '/contacts/{id}'],
    post: ['/contacts'],
    patch: ['/contacts/{id}'],
    delete: ['/contacts/{id}'],
  },
  {
    key: 'orders',
    get: ['/orders', '/orders/{id}'],
    post: ['/orders', '/orders/{id}/items'],
    patch: ['/orders/{id}', '/orders/{id}/items/{item_id}'],
    delete: [],
  },
  {
    key: 'orders_delivery_add',
    get: [],
    post: ['/orders/{id}/delivery'],
    patch: [],
    delete: [],
  },
  {
    key: 'orders_approve',
    get: ['/orders', '/orders/{id}', '/orders/{id}/items/{item_id}'],
    post: ['/orders/{id}/item'],
    patch: [
      '/orders',
      '/orders/{id}',
      '/orders/{id}/items/{item_id}',
      '/orders/{id}/status/confirm',
      '/orders/{id}/status/reject',
      '/orders/{id}/status/cancel',
    ],
    delete: [],
  },
  {
    key: 'orders_payment_approve',
    get: [
      '/orders',
      '/orders/{id}',
      '/orders/{id}/items/{item_id}',
      '/payments',
      '/payments/{id}',
    ],
    post: [],
    patch: ['/payments/{id}/status/confirm', '/payments/{id}/status/reject'],
    delete: [],
  },
  {
    key: 'orders_delivery_approve',
    get: ['/orders', '/orders/{id}', '/orders/{id}/items/{item_id}'],
    post: [],
    patch: [
      '/orders/{id}/delivery/{delivery_id}',
      '/order/{id}/delivery/{delivery_id}/status/confirm',
      '/order/{id}/delivery/{delivery_id}/status/reject',
    ],
    delete: [],
  },
  {
    key: 'orders_product_inventory',
    get: [
      '/orders/{id}',
      '/warehouses',
      '/inventories',
      '/inventories/items/stock/stock',
      '/inventories/items/stock/stock/info',
    ],
    post: ['/inventories'],
    patch: ['/orders/{id}'],
    delete: [],
  },
  {
    key: 'warehouses',
    get: ['/warehouses', '/warehouses/{id}'],
    post: ['/warehouses'],
    patch: ['/warehouses', '/warehouses/{id}'],
    delete: ['/warehouses', '/warehouses/{id}'],
  },
  {
    key: 'inventories',
    get: [
      'inventories',
      '/inventories/{id}',
      '/inventories/items/stock/stock',
      '/inventories/items/stock/stock',
      '/inventories/items/items/input',
      '/inventories/items/items/output',
      '/inventories/items/items/transfer',
    ],
    post: ['/inventories'],
    patch: ['/inventories/{id}', '/inventories/{id}/items'],
    delete: ['/inventories/{id}', '/inventories/{id}/items'],
  },
  {
    key: 'boards',
    get: [
      '/boards',
      '/boards/{id}',
      '/boards/flow/list',
      '/labels',
      '/labels/{id}',
      '/groups',
      '/groups/{id}',
    ],
    post: ['/boards', '/boards/{id}/comment'],
    patch: ['/boards/{id}', '/boards/multiple/sequence'],
    delete: ['/boards/{id}'],
  },
  {
    key: 'boards_tools',
    get: ['/groups', '/groups/{id}', '/labels', '/labels/{id}'],
    post: ['/groups', '/labels'],
    patch: ['/groups/{id}', '/labels/{id}'],
    delete: ['/groups/{id}', '/labels/{id}'],
  },
  {
    key: 'projects',
    get: ['/projects', '/projects/{id}'],
    post: ['/projects'],
    patch: ['/projects/{id}'],
    delete: ['/projects/{id}'],
  },
  {
    key: 'payments',
    get: ['/payments', '/payments/{id}'],
    post: ['/payments'],
    patch: [],
    delete: [],
  },
  {
    key: 'transactions',
    get: ['/wallets/transactions', '/wallets/my'],
    post: [],
    patch: [],
    delete: [],
  },
  {
    key: 'reviews',
    get: ['/reviews', '/reviews/{id}'],
    post: ['/reviews'],
    patch: ['/reviews/{id}'],
    delete: ['/reviews/{id}'],
  },
  {
    key: 'questions',
    get: ['/questions', '/questions/{id}'],
    post: ['/questions'],
    patch: ['/questions/{id}'],
    delete: ['/questions/{id}'],
  },
  {
    key: 'answers',
    get: ['/questions', '/questions/{id}'],
    post: ['/questions/{id}/answers'],
    patch: [],
    delete: [],
  },
  {
    key: 'settings',
    get: [],
    post: [],
    patch: ['/settings'],
    delete: [],
  },
  {
    key: 'analytics',
    tag: 'داشبورد',
    get: ['/analytics/stats'],
    post: [],
    patch: [],
    delete: [],
  },
  {
    key: 'storage',
    tag: 'فایل',
    get: [
      '/private-files',
      '/private-files/{bucket_name}/{object_name}',
      '/public-files',
      '/public-files/{bucket_name}/{object_name}',
    ],
    post: ['/private-files', '/public-files'],
    patch: [],
    delete: [],
  },
];
