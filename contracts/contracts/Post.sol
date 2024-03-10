// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @notice A contract that stores posts.
 */
contract Post is ERC721URIStorage {
    uint private _nextTokenId;
    mapping(address owner => uint[] tokenIds) _posts;
    mapping(uint tokenId => address[] likerAddresses) private _likers;
    mapping(uint tokenId => uint[] commentTokenIds) private _comments;

    constructor() ERC721("U2U - Posts", "U2UP") {}

    function create(string memory tokenURI) external {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _posts[msg.sender].push(tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function like(uint tokenId) external {
        require(!_isLiker(tokenId, msg.sender), "Already liked");
        _likers[tokenId].push(msg.sender);
    }

    function comment(uint tokenId, string memory commentTokenURI) external {
        uint256 commentTokenId = _nextTokenId++;
        _mint(msg.sender, commentTokenId);
        _setTokenURI(commentTokenId, commentTokenURI);
        _comments[tokenId].push(commentTokenId);
    }

    function getNextTokenId() external view returns (uint) {
        return _nextTokenId;
    }

    function getPosts(
        address author
    ) external view returns (uint[] memory tokenIds) {
        return _posts[author];
    }

    function getLikers(uint tokenId) external view returns (address[] memory) {
        return _likers[tokenId];
    }

    function getComments(
        uint tokenId
    ) external view returns (uint[] memory commentTokenIds) {
        return _comments[tokenId];
    }

    function _isLiker(
        uint tokenId,
        address account
    ) internal view returns (bool) {
        for (uint i = 0; i < _likers[tokenId].length; i++) {
            if (_likers[tokenId][i] == account) {
                return true;
            }
        }
        return false;
    }
}
