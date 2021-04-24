import React, {dangerouslySetInnerHTML} from 'react';
import { Link } from 'react-router-dom';

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3, replacePattern4;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1,  require("react").createElement('div', null, `sad`));

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2,  require("react").createElement('div', null, `Hello `));

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3,  require("react").createElement('a', null, `sad`));

    // hash tag
    replacePattern4 = /([#|＃][^\s]+)/g;
    replacedText = replacedText.replace(replacePattern4, '<a href="/search/$1">$1</a>');

    return replacedText;
}


export default function Linkify(props){
    let re = linkify(props.children);
    return re;
}