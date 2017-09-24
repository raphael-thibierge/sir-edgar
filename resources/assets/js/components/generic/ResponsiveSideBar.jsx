const React = require('react');
const FormControl = require('react-bootstrap').FormControl;
const Button = require('react-bootstrap').Button;
const Glyphicon = require('react-bootstrap').Glyphicon;

const PropTypes = require('prop-types');
const SideNav = require('react-sidenav').SideNav;
const Nav = require('react-sidenav').Nav;
const NavText = require('react-sidenav').NavText;


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

const ResponsiveSideBar = React.createClass({



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
                        Dashboard
                    </div>
                </SeparatorTitle>
                {Object.keys(NavMain).map(key =>
                    <Nav key={key} id={key}>
                        <NavText> {NavMain[key].title} </NavText>
                    </Nav>
                )}
                <SeparatorTitle>
                    <div> Projects</div>
                </SeparatorTitle>
                {this.props.projects.map(project =>
                    <Nav key={project._id} id={project._id}>
                        <NavText>
                            {project.title}
                        </NavText>
                    </Nav>
                )}

            </SideNav>
        )
    }
});

ResponsiveSideBar.propTypes = {
    projects: PropTypes.array.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired


};

module.exports = ResponsiveSideBar;