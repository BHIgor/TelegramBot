const kb = require('./keyboard-buttons')

module.exports = {
    home:[
     [kb.home.glaza, kb.home.podpschik],
     [kb.home.koment, kb.home.avto],
     [kb.home.reaction, kb.home.keryvannya],
     [kb.home.profile,kb.home.qiwiKosh, kb.home.instruction]
    ],
    tarif:[
        [kb.tarif.day, kb.tarif.three],
        [kb.tarif.week, kb.tarif.month],
        [kb.tarif.back]
    ],
    komentReaction:[
        [kb.home.koment, kb.home.reaction]
    ],
    blockhome:[
        [kb.blockhome.kupit, kb.blockhome.proba ],
        [kb.blockhome.podpschik, kb.blockhome.tarif],
        [kb.home.koment, kb.home.reaction],
        [kb.blockhome.profile, kb.blockhome.qiwiKosh, kb.blockhome.instruction]
    ],
    profile:[
        [kb.profile.balance, kb.profile.tarif],
        [kb.profile.referal],
        [kb.back]
    ],
    refprog:[
        [kb.profile.obmen, kb.profile.vivod],
        [kb.back]
    ],
    yesornot:[
        [kb.yesornot.yes,kb.back],
    
    ],
    qiwiKosh:[
        [kb.home.qiwibuy],
        [kb.back]
    ],
    podpisota:[
        [kb.podpischik.qweek,kb.podpischik.slow],
        [kb.back]
    ],
    back:[
        [kb.back]
    ],
    
   

}