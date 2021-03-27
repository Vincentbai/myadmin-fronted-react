// 根据配置动态生成目录
import {
    AppstoreOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    ContainerOutlined,
    PlusOutlined,
    SnippetsOutlined,
    DashboardOutlined,
    FolderViewOutlined,
  } from '@ant-design/icons';

const menuList = [
    {
        title: 'Dashboard',
        key: '/home1',
        icon: DashboardOutlined,
        count: 0,
    },
    {
        title: 'Orders',
        key: '/orders1',
        icon: SnippetsOutlined,
        count: 0,
        children: [
            {
                title: 'New Order',
                key: '/newOrder',
                icon: PlusOutlined,
                count: 0,
            },
            {
                title: 'All Orders',
                key: '/viewAll',
                icon: SnippetsOutlined,
                count: 0,
            },
            {
                title: 'Order Status',
                key: '/viewOrders',
                icon: FolderViewOutlined,
                count: 0,
                children: [
                    {
                        title: 'Quote',
                        key: '/quote',
                        icon: '',
                        count: 5,
                    },
                    {
                        title: 'in picking',
                        key: '/pick',
                        icon: '',
                        count: 5,
                    },
                    {
                        title: 'in workshop',
                        key: '/workshop',
                        icon: '',
                        count: 6,
                    },
                    {
                        title: 'in powder coating',
                        key: '/powderCoating',
                        icon: '',
                        count: 7,
                        
                    },
                    {
                        title: 'Ready',
                        key: '/powderCoating',
                        icon: '',
                        count: 4,
                        
                    },
                ]
            },
        ]
    },
    {
        title: 'Products',
        key: '/products1',
        icon: AppstoreOutlined,
        count: 0,
        
    },
    {
        title: 'Customers',
        key: '/customers1',
        icon: AppstoreOutlined,
        count: 0,
    },
    {
        title: 'Purchases',
        key: '/purchases1',
        icon: AppstoreOutlined,
        count: 0,
    },
    {
        title: 'Suppliers',
        key: '/suppliers1',
        icon: AppstoreOutlined,
        count: 0,
    },
    {
        title: 'Reports',
        key: '/reports1',
        icon: AppstoreOutlined,
        count: 0,
    },
    {
        title: 'System Admin',
        key: '/system1',
        icon: AppstoreOutlined,
        count: 0,
    },



    {
        title: 'Dashboard',
        key: '/home',
        icon: PieChartOutlined,
        count: 0,
    },
    {
        title: 'Products',
        key: '/products',
        icon: AppstoreOutlined,
        count: 0,
        children: [
            {
                title: 'Product Categories',
                key: '/category',
                icon: '',
                count: 0,
            },
            {
                title: 'Product Management',
                key: '/product',
                icon: '',
                count: 0,
            },
        ]
    },
    {
        title: 'Users',
        key: '/user',
        icon: ContainerOutlined,
        count: 0,
    },
    {
        title: 'Roles',
        key: '/role',
        icon: MenuFoldOutlined,
        count: 0,
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: PieChartOutlined,
        count: 0,
        children: [
            {
                title: 'Bar Charts',
                key: '/charts/bar',
                icon: '',
                count: 0,
            },
            {
                title: 'Line Charts',
                key: '/charts/line',
                icon:'',
                count: 0,
            },
            {
                title: 'Pie Charts',
                key: '/charts/pie',
                icon: '',
                count: 0,
            },
        ]
    },
]

// 默认暴露的模块，在引入的时候可以起任意的名字
export default menuList