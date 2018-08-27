import React from 'react'
import PropTypes from 'prop-types'
import { AnimatedSwitch } from 'react-router-transition'
import { Switch } from 'react-router-dom'
import { Layout } from 'antd'
import Loading from 'share/component/Loading'
import s from './style.m.less'

const { Content } = Layout

// 配置路由切换动画
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    left: `${styles.x}px`,
  }
}
const transition = {
  atEnter: {
    opacity: 0,
    x: 100,
  },
  atLeave: {
    opacity: 0,
    x: -100,
  },
  atActive: {
    opacity: 1,
    x: 0,
  },
}

const AppContent = ({ loading, children }) => {
  const content = loading ? (
    <Loading />
  ) : (
    <Switch>
      <AnimatedSwitch
        id="animateWrapper"
        atEnter={transition.atEnter}
        atLeave={transition.atLeave}
        atActive={transition.atActive}
        mapStyles={mapStyles}
        className={s.animateWrapper}
      >
        {children}
      </AnimatedSwitch>
    </Switch>
  )
  return <Content id="appContent">{content}</Content>
}

AppContent.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
}

AppContent.defaultProps = {
  loading: true,
  children: null,
}

export default AppContent
