'use strict';

var verseKey = require("./verseKey");
var zText = require("./zText");
var filterMgr = require("./filterMgr");
var versificationMgr = require("./versificationMgr");


class SwordModule {
    constructor(index) {
        this.config = index.config;
        this.rawPosOT = index.rawPosOT;
        this.rawPosNT = index.rawPosNT;
        this.binaryOT = index.binaryOT;
        this.binaryNT = index.binaryNT;
        this.config = index.config;
    }

    renderText(verseRange, inOptions) {
        var verseList = verseKey.parseVerseList(verseRange, this.config.Versification);
        let bookChapterVersePosition = null;
        let binaryBlob = null;

        if (this.rawPosOT.hasOwnProperty(verseList[0].book)) {
            bookChapterVersePosition = this.rawPosOT[verseList[0].book];
            binaryBlob = this.binaryOT;
        }
        else if (this.rawPosNT.hasOwnProperty(verseList[0].book)) {
            bookChapterVersePosition = this.rawPosNT[verseList[0].book];
            binaryBlob = this.binaryNT;
        }
        else {
            throw new Error('Unable to retrieve book from module');
        }

        zText.getRawEntry(binaryBlob, bookChapterVersePosition, verseList,
            this.config.Encoding, inOptions.intro ? inOptions.intro : false,
            function (isError, inRaw) {
            if (isError) {
                throw isError;
            }
            var result = filterMgr.processText(inRaw, this.config.SourceType, this.config.Direction, inOptions);
        });

    }

    //inOsis can be Matt.3
    getVersesInChapter(inOsis) {
        return versificationMgr.getVersesInChapter(versificationMgr.getBookNum(inOsis.split(".")[0], this.config.Versification), inOsis.split(".")[1], this.config.Versification);
    }
}

module.exports = SwordModule;