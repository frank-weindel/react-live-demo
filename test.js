'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _fido = require('fido');
var _whenKeys = require('when/keys');
var _whenKeys2 = _interopRequireDefault(_whenKeys);
var _underscore = require('underscore');
var _underscore2 = _interopRequireDefault(_underscore);
var _commonComponentsSheetSection = require('common/components/SheetSection');
var _commonComponentsSheetSection2 = _interopRequireDefault(_commonComponentsSheetSection);
var _commonGlobalUtils = require('common/globalUtils');
var _commonGlobalUtils2 = _interopRequireDefault(_commonGlobalUtils);
var _FootballHeaderSheet = require('../FootballHeaderSheet');
var _FootballHeaderSheet2 = _interopRequireDefault(_FootballHeaderSheet);
var _commonFootballComponentsPlayerSquare = require('common/football/components/PlayerSquare');
var _commonFootballComponentsPlayerSquare2 = _interopRequireDefault(_commonFootballComponentsPlayerSquare);
var _commonComponentsStatGrid = require('common/components/StatGrid');
var _commonComponentsStatGrid2 = _interopRequireDefault(_commonComponentsStatGrid);
require('./game-leaders-sheet.less');
var GameLeadersSheet = _react2['default'].createClass({
    displayName: 'GameLeadersSheet',
    sheetClassName: 'otsShareSheet otsGameLeadersSheet',
    mixins: [_fido.FidoSheetMixin],
    propTypes: {
        gameId: _react2['default'].PropTypes.oneOfType([
            _react2['default'].PropTypes.string,
            _react2['default'].PropTypes.number
        ]).isRequired,
        userHeading: _react2['default'].PropTypes.string
    },
    getDefaultProps: function getDefaultProps() {
        return { gameId: 0 };
    },
    fetchData: function fetchData(props) {
        var provider = props.provider;
        var gameId = props.gameId;
        return _whenKeys2['default'].all({
            passingLeader: provider.getGameLeader({ gameId: gameId }, 'passing'),
            rushingLeader: provider.getGameLeader({ gameId: gameId }, 'rushing'),
            receivingLeader: provider.getGameLeader({ gameId: gameId }, 'receiving')
        }).then(function (results) {
            return _whenKeys2['default'].all(_underscore2['default'].extend(results, {
                passingLeaderStats: provider.getSeasonStats({ playerId: results.passingLeader.id }),
                rushingLeaderStats: provider.getSeasonStats({ playerId: results.rushingLeader.id }),
                receivingLeaderStats: provider.getSeasonStats({ playerId: results.receivingLeader.id })
            }));
        });
    },
    renderStatGrid: function renderStatGrid(player, playerStats, statPaths) {
        var value = 0;
        var gridStats = statPaths.map(function (stat) {
            if (stat.path === 'compRatio') {
                var att = +_commonGlobalUtils2['default'].extractStat(playerStats, 'passing.attempts', '1');
                var comp = +_commonGlobalUtils2['default'].extractStat(playerStats, 'passing.completions', '0');
                value = comp / att * 100;
            } else if (stat.path === 'totalTds') {
                value = +_commonGlobalUtils2['default'].extractStatSum(playerStats, [
                    'passing.touchdowns',
                    'rushing.touchdowns',
                    'receiving.touchdowns'
                ], '0');
            } else {
                value = +_commonGlobalUtils2['default'].extractStat(playerStats, stat.path, '0');
            }
            return {
                title: stat.label,
                value: value,
                rank: 0,
                valueType: 'number'
            };
        });
        return _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-stat-grid' }, _react2['default'].createElement(_commonComponentsStatGrid2['default'], {
            stats: gridStats,
            columns: 2,
            color: player.color,
            flipped: true
        }));
    },
    render: function render() {
        var _props = this.props;
        var gameId = _props.gameId;
        var provider = _props.provider;
        var dark = _props.dark;
        var userHeading = _props.userHeading;
        var _state$data = this.state.data;
        var passingLeader = _state$data.passingLeader;
        var rushingLeader = _state$data.rushingLeader;
        var receivingLeader = _state$data.receivingLeader;
        var passingLeaderStats = _state$data.passingLeaderStats;
        var rushingLeaderStats = _state$data.rushingLeaderStats;
        var receivingLeaderStats = _state$data.receivingLeaderStats;
        var passing = [
            {
                label: 'PASS YDS',
                path: 'passing.yards'
            },
            {
                label: 'COMP %',
                path: 'compRatio'
            },
            {
                label: 'TD',
                path: 'passing.touchdowns'
            },
            {
                label: 'INT ?',
                path: '?'
            }
        ];
        var rushing = [
            {
                label: 'RUSH YDS',
                path: 'rushing.yards'
            },
            {
                label: 'TD',
                path: 'rushing.touchdowns'
            },
            {
                label: 'CARRIES',
                path: '?'
            },
            {
                label: 'YDS/C',
                path: 'rushing.ypc'
            }
        ];
        var receiving = [
            {
                label: 'REC YDS',
                path: 'receiving.yards'
            },
            {
                label: 'TD',
                path: 'receiving.touchdowns'
            },
            {
                label: 'TARGETS',
                path: 'receiving.targeted'
            },
            {
                label: 'REC',
                path: 'receiving.receptions'
            }
        ];
        return _react2['default'].createElement('div', { className: this.sheetClassname }, _react2['default'].createElement(_FootballHeaderSheet2['default'], {
            gameId: gameId,
            mode: 'blockscore',
            provider: provider,
            dark: dark,
            form: 'small'
        }), _react2['default'].createElement(_commonComponentsSheetSection2['default'], {
            heading: 'GAME LEADERS',
            userHeading: userHeading,
            marginTop: false
        }, _react2['default'].createElement('div', null, _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-container' }, _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-heading' }, 'PASSING?'), _react2['default'].createElement(_commonFootballComponentsPlayerSquare2['default'], { player: passingLeader })), _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-container' }, _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-heading' }, 'RUSHING?'), _react2['default'].createElement(_commonFootballComponentsPlayerSquare2['default'], { player: rushingLeader })), _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-container' }, _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-player-square-heading' }, 'RECEIVING?'), _react2['default'].createElement(_commonFootballComponentsPlayerSquare2['default'], { player: receivingLeader }))), _react2['default'].createElement('div', { className: 'otsGameLeadersSheet-stat-grid-container' }, this.renderStatGrid(passingLeader, passingLeaderStats, passing), this.renderStatGrid(rushingLeader, rushingLeaderStats, rushing), this.renderStatGrid(receivingLeader, receivingLeaderStats, receiving))));
    }
});
exports['default'] = GameLeadersSheet;
module.exports = exports['default'];