// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Input, IconFont, Dropdown, ComponentColor, ComponentSize,
} from '@influxdata/clockface';
import DTsContents from '../components/DTsContents';

// Actions
import { fetchGetAllDTs } from "../../store";

// Utilities
import { filterDTsBySearchTerm } from "../../shared/utils/filter";
import { sortDTs } from "../../shared/utils/sort";

// Constants
import { sortTypes, privacyTypes } from "../../shared/constants/constants";

class DTs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: "",
            sortType: { key: "name-a-to-z", label: "Name (A → Z)" },
            privacyType: { key: "all", label: "All Digital Twins" },
        }
    }

    componentDidMount() {
        const { fetchGetAllDTs } = this.props;

        fetchGetAllDTs();
    }

    filterDTs = () => {
        const { searchTerm, sortType } = this.state;
        let dts = JSON.parse(JSON.stringify(this.props.dts));

        dts = filterDTsBySearchTerm(dts, searchTerm);

        dts = sortDTs(dts, sortType);

        return dts;
    }

    render() {
        const { searchTerm, sortType, privacyType } = this.state;

        return (
            <>
                <Page>
                    <Page.Header fullWidth={false}>
                        <Page.Title title={"Digital Twin Pool"} />
                    </Page.Header>

                    <Page.ControlBar fullWidth={false}>
                        <Page.ControlBarLeft className="dashboard-filter-buttons">
                            <Input
                                icon={IconFont.Search}
                                placeholder={"Filter DTs"}
                                value={searchTerm}
                                onChange={(e) => {
                                    this.setState({ searchTerm: e.target.value },
                                        () => this.filterDTs())
                                }}
                                onBlur={this.handleBlur}
                                style={{ minWidth: '210px', width: '210px' }}
                            />
                            <Dropdown
                                button={(active, onClick) => (
                                    <Dropdown.Button
                                        onClick={onClick}
                                        active={active}
                                    >
                                        {`Sort by ${sortType.label}`}
                                    </Dropdown.Button>
                                )}
                                menu={onCollapse => (
                                    <Dropdown.Menu onCollapse={onCollapse}>
                                        {sortTypes.map(item => (
                                            <Dropdown.Item
                                                key={item.key}
                                                value={item}
                                                onClick={(e) => {
                                                    this.setState({ sortType: e },
                                                        () => this.filterDTs())
                                                }}
                                                selected={item.key === sortType.key}
                                            >
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                                style={{ flexBasis: `210px`, width: `210px` }}
                            />
                            <Dropdown
                                button={(active, onClick) => (
                                    <Dropdown.Button
                                        onClick={onClick}
                                        active={active}
                                    >
                                        {privacyType.label}
                                    </Dropdown.Button>
                                )}
                                menu={onCollapse => (
                                    <Dropdown.Menu onCollapse={onCollapse}>
                                        {privacyTypes.map(item => (
                                            <Dropdown.Item
                                                key={`${item.sortKey}${item.sortDirection}`}
                                                value={item}
                                                onClick={this.sortDts}
                                                selected={item.key === sortType.key}
                                            >
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                                style={{ flexBasis: `210px`, width: `210px` }}
                            />
                        </Page.ControlBarLeft>
                        <Page.ControlBarRight>
                            <Dropdown
                                button={(active, onClick) => (
                                    <Dropdown.Button
                                        active={active}
                                        onClick={onClick}
                                        color={ComponentColor.Primary}
                                        size={ComponentSize.Small}
                                        icon={IconFont.Plus}
                                    >
                                        {privacyType.label}
                                    </Dropdown.Button>
                                )}
                                menu={onCollapse => (
                                    <Dropdown.Menu onCollapse={onCollapse}>
                                        {privacyTypes.map(item => (
                                            <Dropdown.Item
                                                key={`${item.sortKey}${item.sortDirection}`}
                                                value={item}
                                                onClick={this.sortDts}
                                                selected={item.key === sortType.key}
                                            >
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                                style={{ flexBasis: `210px`, width: `210px` }}
                            />
                        </Page.ControlBarRight>
                    </Page.ControlBar>

                    <Page.Contents
                        fullWidth={false}
                        scrollable={true}
                    >
                        <DTsContents
                            dts={this.filterDTs()}
                        />
                    </Page.Contents>
                </Page>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dts: state.dt.dts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetAllDTs: () => dispatch(fetchGetAllDTs()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTs);