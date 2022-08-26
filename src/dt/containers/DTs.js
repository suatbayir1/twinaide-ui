// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Input, IconFont, Dropdown, ComponentColor, ComponentSize,
} from '@influxdata/clockface';
import DTsContents from '../components/DTsContents';
import DigitalTwinImportOverlay from '../overlays/DigitalTwinImportOverlay';

// Actions
import { fetchGetAllDTs, setImportDTFromTwinbaseOverlay, setImportDTFromKmackOverlay } from "../../store";

// Utilities
import { filterDTsBySearchTerm, filterDTsByPrivacy } from "../../shared/utils/filter";
import { sortDTs } from "../../shared/utils/sort";

// Constants
import { sortTypes, privacyTypes, createOptions } from "../../shared/constants/constants";

class DTs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: "",
            sortType: { key: "name-a-to-z", label: "Name (A → Z)" },
            privacyType: { key: "all", label: "All Digital Twins" },
            createOption: { key: "import", label: "Import Digital Twin" },
            visibleImportOverlay: false,
        }
    }

    componentDidMount() {
        const { fetchGetAllDTs } = this.props;

        fetchGetAllDTs();
    }

    filterDTs = () => {
        const { searchTerm, sortType, privacyType } = this.state;
        const { user } = this.props;

        let dts = JSON.parse(JSON.stringify(this.props.dts));

        dts = filterDTsBySearchTerm(dts, searchTerm);
        dts = sortDTs(dts, sortType);
        dts = filterDTsByPrivacy(dts, privacyType, user);

        return dts;
    }

    openCreateOverlay = (type) => {
        console.log("type", type);
        switch (type.key) {
            case "import":
                this.setState({ visibleImportOverlay: true });
                break;
            case "import-twinbase":
                console.log("clicked");
                this.props.setImportDTFromTwinbaseOverlay(true);
                break;
            case "import-kmac":
                console.log("kmac");
                this.props.setImportDTFromKmackOverlay(true);
                break;
            default:
                break;
        }
    }

    render() {
        const { searchTerm, sortType, privacyType, createOption, visibleImportOverlay } = this.state;

        return (
            <>
                <DigitalTwinImportOverlay
                    visible={visibleImportOverlay}
                    onClose={() => { this.setState({ visibleImportOverlay: false }) }}
                />

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
                                                key={item.key}
                                                value={item}
                                                onClick={(e) => {
                                                    this.setState({ privacyType: e },
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
                                        {createOption.label}
                                    </Dropdown.Button>
                                )}
                                menu={onCollapse => (
                                    <Dropdown.Menu onCollapse={onCollapse}>
                                        {createOptions.map(item => (
                                            <Dropdown.Item
                                                key={item.key}
                                                value={item}
                                                onClick={this.openCreateOverlay}
                                                selected={item.key === createOption.key}
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
                            openCreateOverlay={this.openCreateOverlay}
                        />
                    </Page.Contents>
                </Page>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        dts: state.dt.dts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetAllDTs: () => dispatch(fetchGetAllDTs()),
        setImportDTFromTwinbaseOverlay: (payload) => dispatch(setImportDTFromTwinbaseOverlay(payload)),
        setImportDTFromKmackOverlay: (payload) => dispatch(setImportDTFromKmackOverlay(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTs);