// Libraries
import { IconFont } from '@influxdata/clockface'

export const hierarchy = [
    {
        id: 'my-projects',
        icon: IconFont.Star,
        label: 'Projects',
        link: {
            type: 'link',
            location: `/my-projects`,
        },
        activeKeywords: ['my-projects', 'project'],
        permitted: ['member', 'admin', 'editor'],
    },
    {
        id: 'did',
        icon: IconFont.Link,
        label: 'DID',
        link: {
            type: 'link',
            location: `/did`,
        },
        activeKeywords: ['did'],
        permitted: ['member', 'admin', 'editor'],
    },
    {
        id: 'example',
        icon: IconFont.Pulse,
        label: 'Example',
        link: {
            type: 'link',
            location: `/example`,
        },
        activeKeywords: ['', 'example'],
        permitted: ['member', 'admin', 'editor'],
    },
]