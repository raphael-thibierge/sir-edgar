import React from 'react';
import SvgIcon from 'react-icons-kit';
import {
    ic_business,
    ic_create_new_folder,
    ic_folder,
    ic_folder_special,
    ic_equalizer,
    ic_list,
    ic_warning,
    ic_work,
    ic_attach_money,
} from 'react-icons-kit/md';

import {SideNav, Nav, NavText, NavIcon} from 'react-sidenav';
import PropTypes from 'prop-types';

const NavMain = {
    stats: { title: 'Stats', icon: ic_equalizer},
    important: { title: 'Important goals', icon: ic_warning},
    all_goals: { title: 'All goals', icon: ic_list},
    new_project: { title: 'New project', icon:ic_create_new_folder},
};

const SeparatorTitleContainer = (props)=>
    <div style={{fontSize: '14px',color: '#AAA',margin: '10px 12p',padding: '4px 12px 2px'}}>
        {props.children}
    </div>
;

const SeparatorTitle = props => {
    return (
        <SeparatorTitleContainer>
            {props.children}
            <hr style={{ border: 0, borderTop: '1px solid #E5E5E5' }} />
        </SeparatorTitleContainer>
    );
};

export default class ResponsiveSideBar extends React.Component{

    render(){
        return (
            <SideNav
                highlightBgColor="#eee"
                highlightColor="#E91E63"
                selected={this.props.selected}
                onItemSelection={this.props.onItemSelection}
            >

                <SeparatorTitle>
                    <div>
                        Productivity
                    </div>
                </SeparatorTitle>
                {Object.keys(NavMain).map(key =>
                    <Nav key={key} id={key}>
                        <NavIcon><SvgIcon size={20} icon={NavMain[key].icon}/></NavIcon>
                        <NavText> {NavMain[key].title} </NavText>
                    </Nav>
                )}

                <Nav id="projects">
                    <NavText>Projects</NavText>
                    <NavIcon><SvgIcon size={20} icon={ic_folder_special}/></NavIcon>

                    {this.props.projects.map(project => !project.is_archived ?
                        <Nav key={project._id} id={project._id}>
                            <NavIcon><SvgIcon size={20} icon={ic_folder}/></NavIcon>
                            <NavText>{project.title}</NavText>
                        </Nav> : null
                    )}
                </Nav>
                <br/>
                <SeparatorTitle>
                    <div>Finance</div>
                </SeparatorTitle>

                <Nav id="expenses">
                    <NavIcon><SvgIcon size={20} icon={ic_attach_money}/></NavIcon>
                    <NavText>Expenses</NavText>
                </Nav>

                <Nav id="budgets">
                    <NavIcon><SvgIcon size={20} icon={ic_work}/></NavIcon>
                    <NavText>Budgets</NavText>
                </Nav>

                <Nav id="tags_frequency">
                    <NavIcon><SvgIcon size={20} icon={ic_equalizer}/></NavIcon>
                    <NavText>Tags stats</NavText>
                </Nav>

                <Nav key={'expense_stats'} id={'expense_stats'}>
                    <NavIcon><SvgIcon size={20} icon={ic_equalizer}/></NavIcon>
                    <NavText>Graph</NavText>
                </Nav>

            </SideNav>
        )
    }
};

ResponsiveSideBar.propTypes = {
    projects: PropTypes.array.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired
};