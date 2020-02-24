'use strict'

const Database = use('Database')

class StatsController {

  async index ({ auth }) {
    const userSkillPoints = await Database.table('skills')
    .select([
      'skills.name AS skill_name',
      'skills.short_name AS skill_short_name',
      'skills.color AS skill_color',
      'user_skills.received_skill_points_count AS received_skill_points'
    ])
    .leftJoin('user_skills', 'skills.id', '=', 'user_skills.skill_id')
    .where((builder) => {
      builder.where('user_skills.user_id', '=', auth.user.id)
      builder.orWhereNull('user_skills.user_id')
    })

    return {
      counters: {
        createdSnaps: auth.user.created_snaps_count,
        completedChallenges: auth.user.completed_challenges_count,
        receivedSkillPoints: auth.user.received_skill_points_count
      },
      userSkillPoints: userSkillPoints
    }
  }

}

module.exports = StatsController
