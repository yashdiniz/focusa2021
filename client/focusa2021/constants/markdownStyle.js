import { StyleSheet } from "react-native";

export default {
    singleLineMd: {
        text: {
            color: 'black',
            textAlign: "right"
        },
        view: {
            alignSelf: 'stretch',
        }
    },
    collectiveMd: {
        heading1: {
            color: 'black'
        },
        heading2: {
            color: 'black',
            textAlign: "right"
        },
        strong: {
            color: 'black'
        },
        em: {
            color: 'black'
        },
        text: {
            color: 'black',
        },
        blockQuoteText: {
            color: 'grey'
        },
        blockQuoteSection: {
            flexDirection: 'row',
        },
        blockQuoteSectionBar: {
            width: 3,
            height: null,
            backgroundColor: '#c0c0c0',
            marginEnd: 15,
        },
        codeBlock: {
            fontFamily: 'monospace',
            fontWeight: '500',
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: '#c0c0c0',
            padding: 2,
        },
        inlineCode: {
            fontFamily: 'monospace',
            fontWeight: '500',
            backgroundColor: '#c0c0c0',
            padding: 2,
        },
        tableHeader: {
            backgroundColor: 'grey',
        },
    }
};