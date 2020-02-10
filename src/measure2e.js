import Vue from 'vue'
import renderer from 'vue-server-renderer/basic'
import Card from './components/Card2e.vue'
import Common from './common.scss';
import Measure from './measure.scss';
import Spells from './assets/spells2e.json';

Vue.config.productionTip = false

function createCard(card) {
    return new Vue({
        components: {
            Card
        },
        template: '<Card :card="card" :knownSpells="[]"></Card>',
        data: {
            card: card
        }
    });
}

function splitNodeIntoWords(node) {
    var startOfWord = /\W\b/;
    var result;
    while (startOfWord.exec(node.nodeValue) !== null) {
        result = startOfWord.exec(node.nodeValue);
        node = node.splitText(result.index + 1);
    }
    return node;
}

function splitCard($card) {
    var $card = document.querySelector('.card');
    while ($card != null) {
        var $text = $card.querySelector('.text');
        var $newInner = null;
        if ($text.scrollHeight > $text.clientHeight) {
            var $clone = $card.cloneNode(true);
            $clone.querySelector('.text').innerHTML = '';
            $newInner = $card.parentNode.insertBefore($clone, $card.nextSibling);
            $newInner = $newInner.querySelector('.text');
            for (var j = 0; j < $text.childNodes.length; j++) {
                splitNodeIntoWords($text.childNodes[j]);
            }
        }
        var $textClone = null;
        while ($text.scrollHeight > $text.clientHeight) {
            var $orig = $text.childNodes[$text.childNodes.length - 1];
            var $cloneInner = $orig.cloneNode(true);
            $newInner.insertBefore($cloneInner, $textClone);
            $textClone = $cloneInner;
            $orig.remove();
        }
        $card.normalize();
        $card = $card.nextSibling;
    }
    var $card = document.querySelector('.card');
    var texts = [];
    while ($card != null) {
        var text = $card.querySelector('.text').innerHTML;
        var idx = text.indexOf("<!--COMP-->");
        if (idx != -1) {
            text = text.substring(0, idx);
        }
        texts.push(text);
        $card = $card.nextSibling;
    }
    return texts;
}

const keys = Object.keys(Spells);
const $app = document.querySelector('#app');

const last = keys.length;
var done = false;
for (var i = 0; i < last; i++) {
    renderer(createCard(Spells[keys[i]]), (err, html) => {
        if (err) throw err
        $app.innerHTML = html;
        Spells[keys[i]].description = splitCard();
        if (i == last - 1) {
            done = true;
        }
    });
}

setTimeout(function waitForSpells() {
    if (done != true) {
        setTimeout(waitForSpells, 1000);
        return;
    }

    const code = document.createElement('pre');
    code.setAttribute("id", "json");
    code.textContent = JSON.stringify(Spells);
    document.querySelector('body').appendChild(code);
}, 1000);
