// Libraries
import React, { Component } from 'react'
import {
    Link,
} from 'react-router-dom'

// Constants
import { hierarchy } from "../../shared/constants/navigation";

// Components
import { Icon, TreeNav } from '@influxdata/clockface';

export default class LinkElements extends Component {
    getNavItemActivation = (keywords, location) => {
        const ignoreOrgAndOrgID = 1
        const parentPath = location.split('/').slice(ignoreOrgAndOrgID)

        if (!parentPath.length) {
            parentPath.push("me")
        }

        return keywords.some(path => parentPath.includes(path))
    }

    render() {
        return (
            <>
                {hierarchy.map(item => {
                    const linkElement = (className) => {
                        if (item.link.type === 'href') {
                            return <a
                                href={item.link.location}
                                className={className}
                            />
                        }

                        return <Link to={item.link.location} className={className} />
                    }

                    let navItemElement = (
                        <TreeNav.Item
                            key={item.id}
                            id={item.id}
                            testID={item.testID}
                            icon={<Icon glyph={item.icon} />}
                            label={item.label}
                            shortLabel={item.shortLabel}
                            active={this.getNavItemActivation(
                                item.activeKeywords,
                                window.location.pathname
                            )}
                            linkElement={linkElement}
                        >
                            {Boolean(item.menu) && (
                                <TreeNav.SubMenu>
                                    {item.menu.map(menuItem => {
                                        const linkElement = (className) => {
                                            if (menuItem.link.type === 'href') {
                                                return (
                                                    <a
                                                        href={menuItem.link.location}
                                                        className={className}
                                                    />
                                                )
                                            }

                                            return (
                                                <Link
                                                    to={menuItem.link.location}
                                                    className={className}
                                                />
                                            )
                                        }

                                        let navSubItemElement = (
                                            <TreeNav.SubItem
                                                key={menuItem.id}
                                                id={menuItem.id}
                                                testID={menuItem.testID}
                                                active={this.getNavItemActivation(
                                                    [menuItem.id],
                                                    window.location.pathname
                                                )}
                                                label={menuItem.label}
                                                linkElement={linkElement}
                                            />
                                        )
                                        return navSubItemElement
                                    })}
                                </TreeNav.SubMenu>
                            )}
                        </TreeNav.Item>
                    )
                    return navItemElement
                })}
            </>
        )
    }
}
