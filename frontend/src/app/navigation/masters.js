import DualTableIcon from 'assets/dualicons/table.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import PeopleIcon from 'assets/nav-icons/people.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/masters'

const path = (root, item) => `${root}${item}`;

export const masters = {
    id: 'masters',
    type: NAV_TYPE_ROOT,
    path: '/masters',
    title: 'masters',
    transKey: 'nav.masters.masters',
    Icon: DualTableIcon,
    childs: [
        {
            id: 'masters.region',
            path: path(ROOT_MASTERS, '/region'),
            type: NAV_TYPE_ITEM,
            title: 'Region',
            transKey: 'nav.masters.region',
            Icon: StatisticIcon,
        },
        {
            id: 'masters.target-group',
            path: path(ROOT_MASTERS, '/target-group'),
            type: NAV_TYPE_ITEM,
            title: 'Target Group',
            transKey: 'nav.masters.target-group',
            Icon: PeopleIcon,
        },
        {
            id: 'masters.social-media',
            path: path(ROOT_MASTERS, '/social-media'),
            type: NAV_TYPE_ITEM,
            title: 'Social Media',
            transKey: 'nav.masters.social-media',
            Icon: PeopleIcon,
        },
        {
            id: 'masters.my-goal',
            path: path(ROOT_MASTERS, '/my-goal'),
            type: NAV_TYPE_ITEM,
            title: 'My Goal',
            transKey: 'nav.masters.my-goal',
            Icon: PeopleIcon,
        },
    ]
}
