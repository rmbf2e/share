import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import {
  Icon,
  Tooltip,
  Form,
  Input,
  Alert,
  Modal,
  Spin,
  Card,
  Checkbox,
} from 'antd'
import Tree from 'component/Tree'
import s from './style.m.less'

@inject('store')
@observer
export default class Category extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      category: PropTypes.shape({
        treeModal: PropTypes.bool,
      }),
    }).isRequired,
    title: PropTypes.string.isRequired,
  }

  setFilter = e => {
    const { value } = e.target
    const {
      store: { category },
    } = this.props
    category.setFilter(value)
  }

  updateCategory = () => {
    const {
      store: { category },
    } = this.props
    const { owner } = category
    const ownerStore = this.props.store[owner]
    const keys = toJS(category.checkedCategoryKeys)
    return ownerStore
      .updateCategory(
        {
          dataResType: ownerStore.currentType,
          dataResourceId: keys,
        },
        { [`${owner}Id`]: ownerStore[owner][`${owner}Id`] },
      )
      .finally(() => {
        category.hideModal()
      })
  }

  renderAlert() {
    const {
      store: { category },
    } = this.props
    if (category.owner === 'user') {
      return (
        <Alert
          type="warning"
          message="不可编辑的部分为当前用户所属角色已有的数据权限"
        />
      )
    }
    return null
  }

  render() {
    const {
      store: { category },
    } = this.props
    const checkedKeys = toJS(category.checkedCategoryKeys)
    const data = toJS(category.filteredCategory)
    const disabledKeys = toJS(category.roleCheckedKeys)
    return (
      <Modal
        visible={category.treeModal}
        onCancel={category.hideModal}
        destroyOnClose
        title={this.props.title}
        onOk={this.updateCategory}
        className={s.category}
      >
        <Spin spinning={category.fetchingCategory}>
          <Card
            title={
              <Form layout="inline">
                <Form.Item
                  label={
                    <Tooltip title="仅隐藏不匹配项，不会影响选中项目">
                      过滤 <Icon type="question-circle-o" />
                    </Tooltip>
                  }
                >
                  <Input onChange={this.setFilter} />
                </Form.Item>
              </Form>
            }
          >
            {this.renderAlert()}
            <Checkbox
              onChange={e => {
                category.setCheckedAllKeys(e.target.checked)
              }}
            >
              全选
            </Checkbox>
            <Tree
              onCheck={category.setCheckedCategoryKeys}
              checkedKeys={checkedKeys}
              disabledKeys={disabledKeys}
              data={data}
            />
          </Card>
        </Spin>
      </Modal>
    )
  }
}
