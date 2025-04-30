import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import Statistic2Icon from 'assets/nav-icons/statistic-2.svg?react'
import StethoscopeIcon from 'assets/nav-icons/stethoscope.svg?react'
import PeopleIcon from 'assets/nav-icons/people.svg?react'
import MonitorIcon from 'assets/nav-icons/monitor.svg?react'
import ProjectBoardIcon from 'assets/nav-icons/project-board.svg?react'
import WidgetIcon from 'assets/nav-icons/widget.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Dashboards',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.home',
            path: path(ROOT_DASHBOARDS, '/home'),
            type: NAV_TYPE_ITEM,
            title: 'Home',
            transKey: 'nav.dashboards.home',
            Icon: StatisticIcon,
        },
        {
            id: 'dashboards.brand',
            path: path(ROOT_DASHBOARDS, '/brand'),
            type: NAV_TYPE_ITEM,
            title: 'Brand',
            transKey: 'nav.dashboards.brand',
            Icon: PeopleIcon,
        },
        {
            id: 'dashboards.assets',
            path: path(ROOT_DASHBOARDS, '/assets'),
            type: NAV_TYPE_ITEM,
            title: 'Assets',
            transKey: 'nav.dashboards.assets',
            Icon: ProjectBoardIcon,
        },
        {
            id: 'dashboards.integration',
            path: path(ROOT_DASHBOARDS, '/integration'),
            type: NAV_TYPE_ITEM,
            title: 'Integration',
            transKey: 'nav.dashboards.integration',
            Icon: Statistic2Icon,
        },
        {
            id: 'dashboards.ai-image',
            path: path(ROOT_DASHBOARDS, '/ai-image'),
            type: NAV_TYPE_ITEM,
            title: 'AI Image',
            transKey: 'nav.dashboards.ai-image',
            Icon: WidgetIcon,
        },
        {
            id: 'dashboards.ai-video',
            path: path(ROOT_DASHBOARDS, '/ai-video'),
            type: NAV_TYPE_ITEM,
            title: 'AI Video',
            transKey: 'nav.dashboards.ai-video',
            Icon: StethoscopeIcon,
        },
        // {
        //     id: 'dashboards.campaign',
        //     path: path(ROOT_DASHBOARDS, '/campaign'),
        //     type: NAV_TYPE_ITEM,
        //     title: 'Campaign',
        //     transKey: 'nav.dashboards.campaign',
        //     Icon: MonitorIcon,
        // },
    ]
}
