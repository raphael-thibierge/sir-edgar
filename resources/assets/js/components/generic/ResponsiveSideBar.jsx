import React from 'react';

import PropTypes from 'prop-types';

import {SideNav, Nav, NavText, NavIcon} from 'react-sidenav';


const NavMain = {
    stats: { title: 'Stats'},
    important: { title: 'Important goals'},
    all_goals: { title: 'All goals'},
    new_project: { title: 'New project'},
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
                        <NavText> {NavMain[key].title} </NavText>
                    </Nav>
                )}

                <Nav id="projects">
                    <NavText>Projects</NavText>

                    {this.props.projects.map(project =>
                        <Nav key={project._id} id={project._id}>
                            <NavText>
                                {project.title}
                            </NavText>
                        </Nav>
                    )}
                </Nav>

                <SeparatorTitle>
                    <div> Finance</div>
                </SeparatorTitle>

                <Nav id="budgets">
                    <NavText> Budgets </NavText>
                </Nav>

                <Nav id="expenses">
                    <NavText> Expense </NavText>
                </Nav>




            </SideNav>
        )
    }
};
/*
ResponsiveSideBar.propTypes = {
    projects: PropTypes.array.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired


};*/