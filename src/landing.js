import Vue from 'vue'
import Style from './common.scss'
import Card from './components/Card.vue'

// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
// OfflinePluginRuntime.install()

Vue.config.productionTip = false;

const CardClass = Vue.extend(Card)

new CardClass({
    propsData: { card: { "school": "Conjuration", "subschools": ["Creation"], "sor": "2", "wiz": "2", "magus": "2", "bloodrager": "2", "id": 1, "name": "Acid Arrow", "components_summary": "V,S,M,F", "components": ["V", "S", "M", "F"], "materials": [{ "kind": "M", "description": "Rhubarb leaf and an adder's stomach" }, { "kind": "F", "description": "A dart" }], "time": "1 std", "tc": "Standard", "ts": false, "range": "400ft+40ft/cl", "duration": "1rd+1rd/3cl", "save": "no", "resistance": "no", "area_targets": [], "description": ["An arrow of acid springs from your hand and speeds to its target. You must succeed on a ranged touch attack to hit your target. The arrow deals <strong>2d4 </strong>points of acid damage with no splash damage. For every three caster levels you possess, the acid, unless neutralized, lasts for another round (to a maximum of 6 additional rounds at 18th level), dealing another <strong>2d4 </strong>points of damage in each round."], "source": "PFRPG Core", "sla": "2", "descriptors": ["Acid"] }, caster: 'wiz' }
}).$mount('.acidsplash')

new CardClass({
    propsData: {
        card: 
            { "school": "Evocation", "subschools": [""], "sor": "3", "wiz": "3", "id": 1223, "name": "Battering Blast", "components_summary": "V,S", "components": ["V", "S"], "materials": [], "time": "1 std", "tc": "Standard", "ts": false, "range": "25ft+5ft/2cl", "duration": "instant", "save": "<i>Ref.</i>…", "resistance": "yes", "area_targets": [{ "kind": "W", "description": "1 creature or unattended object" }], "description": ["You hurl a fist-sized ball of force resembling a sphere of spikes to ram a designated creature or object. You must succeed on a ranged touch attack to strike your target. On a successful hit, you deal <strong>1d6 </strong>points of force damage per two caster levels (maximum <strong>5d6</strong>). For every 5 caster levels you possess beyond 5th, you gain a second ball of force.  A creature struck by any of these is subject to a bull rush attempt. The force has a Strength modifier equal to your Intelligence, Wisdom, or Charisma modifier (whichever is highest). The CMB ", "for the force's bull rush uses your caster level as its base attack bonus, adding the force's Strength modifier and a <strong>+10 bonus</strong> for each additional blast directed against the same target. Each sphere of force makes its own separate bull rush attempt-if multiple spheres strike one target, you make multiple CMB checks but only take the highest result to determine success. If the bull rush succeeds, the force pushes the creature away from you in a straight line, and the creature must make a Reflex save or fall <strong>prone</strong>. This spell pushes an unattended ", "object struck by it <strong>20 feet</strong> away from you, provided it weighs no more than 25 pounds per level (maximum 250 pounds). This spell cannot move creatures or objects beyond your range. Used on a door or other obstacle, the spell attempts a Strength check to destroy it if the sheer damage inflicted by the spell doesn't do the job."], "source": "Dungeons Of Golarion", "sla": "3", "descriptors": ["Force"] }
        , caster: 'wiz'
    }
}).$mount('.batteringblast')


// new Vue({
//     render: h => h(Landing),
// }).$mount('#cards')
