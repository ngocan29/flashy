
// Mock data - không sử dụng Supabase API
export const mockCategories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'web', name: 'Web' },
  { id: 'app', name: 'App' },
  { id: 'software', name: 'Software' },
  { id: 'cad', name: 'CAD' },
  { id: 'excel', name: 'Excel Addin' },
  { id: 'doc', name: 'Documents' },
  { id: 'lip', name: 'Lip' }
];

export const mockProducts = [
  {
    id: '1',
    title: 'Website Template Modern Business',
    description: [
      'Responsive design cho mọi thiết bị',
      'Tích hợp SEO tối ưu',
      'Hỗ trợ đa ngôn ngữ',
      'Tùy chỉnh màu sắc dễ dàng',
      'Tích hợp Google Analytics'
    ],
    price: 99,
    price_sale: 79,
    image_url: 'https://readdy.ai/api/search-image?query=modern%20business%20website%20template%20with%20clean%20design%2C%20professional%20layout%2C%20blue%20and%20white%20color%20scheme%2C%20corporate%20style%2C%20minimalist%20interface&width=400&height=300&seq=web1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'WebDesign Pro',
    rate: 4.8,
    rate_count: 156,
    permit: 'License',
    permit_life: 12,
    category_id: 'web',
    user_id: 1
  },
  {
    id: '2',
    title: 'Mobile App UI Kit Complete',
    description: [
      'Hơn 100 màn hình UI đẹp',
      'Tương thích iOS và Android',
      'File Figma và Sketch',
      'Icon set đầy đủ',
      'Hướng dẫn implementation'
    ],
    price: 149,
    price_sale: 99,
    image_url: 'https://readdy.ai/api/search-image?query=mobile%20app%20ui%20kit%20design%20with%20modern%20interface%2C%20colorful%20screens%2C%20smartphone%20mockups%2C%20clean%20layout%2C%20gradient%20colors&width=400&height=300&seq=app1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'UI Master',
    rate: 4.9,
    rate_count: 203,
    permit: 'Không có',
    permit_life: 24,
    category_id: 'app',
    user_id: 2
  },
  {
    id: '3',
    title: 'Excel Advanced Analytics Plugin',
    description: [
      'Phân tích dữ liệu tự động',
      'Tạo biểu đồ chuyên nghiệp',
      'Xuất báo cáo PDF',
      'Tích hợp API external',
      'Hỗ trợ macro VBA'
    ],
    price: 199,
    image_url: 'https://readdy.ai/api/search-image?query=excel%20spreadsheet%20with%20advanced%20charts%20and%20analytics%2C%20data%20visualization%2C%20professional%20business%20dashboard%2C%20green%20and%20blue%20interface&width=400&height=300&seq=excel1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'Excel Expert',
    rate: 4.7,
    rate_count: 89,
    permit: 'License',
    permit_life: 6,
    category_id: 'excel',
    user_id: 3
  },
  {
    id: '4',
    title: 'CAD Architecture Bundle',
    description: [
      'Thư viện 3D models đầy đủ',
      'Template thiết kế nhà ở',
      'Hỗ trợ AutoCAD và SketchUp',
      'Texture và material chất lượng cao',
      'Video hướng dẫn chi tiết'
    ],
    price: 299,
    price_sale: 199,
    image_url: 'https://readdy.ai/api/search-image?query=architectural%20CAD%20drawings%20and%203D%20models%2C%20building%20blueprints%2C%20technical%20design%2C%20professional%20architecture%20software%20interface&width=400&height=300&seq=cad1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'Arch Studio',
    rate: 4.6,
    rate_count: 67,
    permit: 'License',
    permit_life: 18,
    category_id: 'cad',
    user_id: 4
  },
  {
    id: '5',
    title: 'Document Management System',
    description: [
      'Quản lý tài liệu tập trung',
      'Tìm kiếm thông minh',
      'Phân quyền người dùng',
      'Backup tự động',
      'Tích hợp cloud storage'
    ],
    price: 179,
    image_url: 'https://readdy.ai/api/search-image?query=document%20management%20system%20interface%2C%20file%20organization%2C%20digital%20documents%2C%20clean%20software%20design%2C%20blue%20and%20white%20theme&width=400&height=300&seq=doc1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'DocSoft Solutions',
    rate: 4.5,
    rate_count: 124,
    permit: 'Không có',
    permit_life: 12,
    category_id: 'doc',
    user_id: 5
  },
  {
    id: '6',
    title: 'Business Software Suite',
    description: [
      'CRM và quản lý khách hàng',
      'Kế toán và báo cáo tài chính',
      'Quản lý nhân sự',
      'Tích hợp email marketing',
      'Dashboard analytics'
    ],
    price: 399,
    price_sale: 299,
    image_url: 'https://readdy.ai/api/search-image?query=business%20software%20dashboard%20with%20charts%20and%20analytics%2C%20professional%20interface%2C%20corporate%20design%2C%20modern%20layout&width=400&height=300&seq=soft1&orientation=landscape',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    creator_name: 'BizTech Pro',
    rate: 4.8,
    rate_count: 178,
    permit: 'License',
    permit_life: 36,
    category_id: 'software',
    user_id: 6
  }
];

export const mockUsers = [
  { id: 1, name: 'WebDesign Pro', email: 'webdesign@example.com' },
  { id: 2, name: 'UI Master', email: 'uimaster@example.com' },
  { id: 3, name: 'Excel Expert', email: 'excel@example.com' },
  { id: 4, name: 'Arch Studio', email: 'arch@example.com' },
  { id: 5, name: 'DocSoft Solutions', email: 'docsoft@example.com' },
  { id: 6, name: 'BizTech Pro', email: 'biztech@example.com' }
];

export const mockPayments = [
  { id: '1', product_id: '1', buyer_id: 1, seller_id: 1, amount: 79, status: 'completed' },
  { id: '2', product_id: '2', buyer_id: 2, seller_id: 2, amount: 99, status: 'pending' },
  { id: '3', product_id: '3', buyer_id: 1, seller_id: 3, amount: 199, status: 'completed' }
];
