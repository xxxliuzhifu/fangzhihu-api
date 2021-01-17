const jsonwebtoken = require('jsonwebtoken')
const Topic = require('../modal/topics')
const { secret } = require('../config')

class TopicsCtr {
  async find(ctx) {
    // ctx.body = await Topic.find()
    // 分页
    // limit 返回数量
    // skip 返回起点
    const { pre_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(pre_page * 1, 1)
    ctx.body = await Topic.find()
      .limit(perPage)
      .skip(page * perPage)
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ' +' + f)
      .join('')
    console.log('selectFields', selectFields)
    // introduction  只展示introduction
    //+introduction  在原来的基础上添加introduction
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  async create(ctx) {
    console.log('11')
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }
}

module.exports = new TopicsCtr()