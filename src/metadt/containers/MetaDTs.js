// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Input, IconFont, Dropdown, ComponentColor, Button,
} from '@influxdata/clockface';

// Actions
import { setCreateMetaDTOverlay, fetchGetAllDTs, fetchGetAllMetaDTs } from "../../store";

// Utilities
import { filterDTsBySearchTerm, filterDTsByPrivacy } from "../../shared/utils/filter";
import { sortDTs } from "../../shared/utils/sort";

// Constants
import { sortTypes, privacyTypes } from "../../shared/constants/constants";
import MetaDTsContents from '../components/MetaDTsContents';

class MetaDTs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: "",
            sortType: { key: "name-a-to-z", label: "Name (A → Z)" },
            privacyType: { key: "all", label: "All Digital Twins" },
            createOption: { key: "form", label: "New Digital Twin" },
            visibleImportOverlay: false,
        }
    }

    componentDidMount() {
        const { fetchGetAllDTs, fetchGetAllMetaDTs } = this.props;

        fetchGetAllDTs();
        fetchGetAllMetaDTs();
    }

    filterMetaDTs = () => {
        const { searchTerm, sortType, privacyType } = this.state;
        const { user } = this.props;

        let metadts = JSON.parse(JSON.stringify(this.props.metadts));

        metadts = filterDTsBySearchTerm(metadts, searchTerm);
        metadts = sortDTs(metadts, sortType);
        metadts = filterDTsByPrivacy(metadts, privacyType, user);

        return metadts;
    }

    render() {
        const { searchTerm, sortType, privacyType, } = this.state;

        return (
            <Page>
                <Page.Header fullWidth={false}>
                    <Page.Title title={"Meta Digital Twin Pool"} />
                </Page.Header>

                <Page.ControlBar fullWidth={false}>
                    <Page.ControlBarLeft className="dashboard-filter-buttons">
                        <Input
                            icon={IconFont.Search}
                            placeholder={"Filter MetaDTs"}
                            value={searchTerm}
                            onChange={(e) => {
                                this.setState({ searchTerm: e.target.value },
                                    () => this.filterMetaDTs())
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
                                                    () => this.filterMetaDTs())
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
                                            key={item.key}
                                            value={item}
                                            onClick={(e) => {
                                                this.setState({ privacyType: e },
                                                    () => this.filterMetaDTs())
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
                    </Page.ControlBarLeft>
                    <Page.ControlBarRight>
                        <Button
                            text={"New Meta Digital Twin"}
                            color={ComponentColor.Primary}
                            icon={IconFont.Plus}
                            onClick={() => { this.props.setCreateMetaDTOverlay(true, "create") }}
                        />
                    </Page.ControlBarRight>
                </Page.ControlBar>

                <Page.Contents
                    fullWidth={false}
                    scrollable={true}
                >
                    <MetaDTsContents
                        metadts={this.filterMetaDTs()}
                    />
                </Page.Contents>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        metadts: state.metadt.metadts
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCreateMetaDTOverlay: (payload, mode) => dispatch(setCreateMetaDTOverlay(payload, mode)),
        fetchGetAllDTs: () => dispatch(fetchGetAllDTs()),
        fetchGetAllMetaDTs: () => dispatch(fetchGetAllMetaDTs()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaDTs);