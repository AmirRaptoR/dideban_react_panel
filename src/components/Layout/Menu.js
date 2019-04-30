import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import Navlink from 'umi/navlink'
import withRouter from 'umi/withRouter'
import { withI18n } from '@lingui/react'
import {
  arrayToTree,
  queryAncestors,
  pathMatchRegexp,
  addLangPrefix,
} from 'utils'
import store from 'store'

const { SubMenu } = Menu

@withRouter
@withI18n()
class SiderMenu extends PureComponent {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = openKeys => {
    const { menus } = this.props
    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)

    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  generateMenus = (data) => {
    const { i18n } = this.props
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon} />}
                <span>{i18n._(item.name)}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={addLangPrefix(item.route) || '#'}>
            {item.icon && <Icon type={item.icon} />}
            <span>{i18n._(item.name)}</span>
          </Navlink>
        </Menu.Item>
      )
    })
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
      i18n
    } = this.props
    // Generating tree-structured data for menu content.
    let menuTree = arrayToTree(menus, 'id', 'menuParentId');
    //     menuTree.forEach(x=>x.name=i18n.t([x.name]));
    // console.log(menuTree)

    // Find a menu that matches the pathname.
    const currentMenu = menus.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Find the key that should be selected according to the current menu.
    const selectedKeys = currentMenu
      ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
      : []

    const menuProps = collapsed
      ? {}
      : {
        openKeys: this.state.openKeys,
      }

    return (
      <Menu
        mode="inline"
        theme={theme}
        onOpenChange={this.onOpenChange}
        inlineCollapsed={collapsed}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
              onCollapseChange(true)
            }
            : undefined
        }
        {...menuProps}
      >
        {this.generateMenus(menuTree, i18n)}
      </Menu>
    )
  }
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default SiderMenu
