'use strict'

const Task = use('Task')
const Env = use('Env')
const Logger = use('Logger')
const Snap = use('App/Models/Snap')
const UserSkill = use('App/Models/UserSkill')

class DistributeSkillPoints extends Task {
  static get schedule () {
    if(Env.get('NODE_ENV') === 'development') {
      return '*/10 * * * * *'
    } else {
      return '0 */10 * * * *'
    }
  }

  async handle () {
    Logger.info('handling DistributeSkillPoints')

    var dateTo = new Date()
    dateTo.setDate(dateTo.getDate() - 1)

    const finishedSnaps = await Snap.query()
    .with('userChallengePivot.user')
    .with('userChallengePivot.challenge.skillPoints')
    .leftJoin('user_challenges', 'user_challenges.id', '=', 'snaps.user_challenge_id')
    .where('snaps.created_at', '<', dateTo)
    .where('user_challenges.status', '=', 'receiving-feedback')
    .groupBy('snaps.id')
    .fetch()

    for(const i in finishedSnaps.rows) {
      const snap = finishedSnaps.rows[i]

      const userChallenge = snap.getRelated('userChallengePivot')
      const user = userChallenge.getRelated('user')
      const challenge = userChallenge.getRelated('challenge')
      const challengeSkillPoints = challenge.getRelated('skillPoints')

      var totalReceivedSkillPoints = 0

      for(const i in challengeSkillPoints.rows) {
        const skill = challengeSkillPoints.rows[i]
        const skillPivot = skill.getRelated('pivot')

        const userSkillRelation = await UserSkill.findOrCreate({
          user_id: user.id,
          skill_id: skill.id
        })

        userSkillRelation.user_id = user.id
        userSkillRelation.skill_id = skill.id
        userSkillRelation.received_skill_points_count = (userSkillRelation.received_skill_points_count || 0) + skillPivot.points
        await userSkillRelation.save()

        totalReceivedSkillPoints += skillPivot.points
      }

      user.completed_challenges_count ++
      user.received_skill_points_count += totalReceivedSkillPoints
      await user.save()

      // Archive the snap
      snap.archived_at = new Date()
      await snap.save()

      // Update user-challenge pivot status.
      userChallenge.status = 'completed'
      await userChallenge.save()
    }

    Logger.info('successfully handled DistributeSkillPoints')
  }
}

module.exports = DistributeSkillPoints
