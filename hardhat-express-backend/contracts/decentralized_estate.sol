// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error DecentralizedEstate__PriceNotMet();
error DecentralizedEstate__NotNftOwner();
error DecentralizedEstate__NoProceeds();
error DecentralizedEstate__TransferFailed();

contract DecentralizedEstate is ERC721URIStorage, Ownable {
    // State Variables
    uint256 private s_tokenId;

    // seller => amount earned
    mapping(address => uint256) private s_proceedings;

    // seller => tokenId => price of property
    mapping(address => mapping(uint256 => uint256)) private s_estatePrice;

    // Events
    event NftMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );

    // Modifiers
    modifier onlyNftOwner(uint256 tokenId) {
        if (msg.sender != _ownerOf(tokenId))
            revert DecentralizedEstate__NotNftOwner();
        _;
    }

    constructor() ERC721("Decentralized Estate", "DRE") Ownable(msg.sender) {
        s_tokenId = 0;
    }

    // Contract Functions //

    function listItem(
        address _to,
        uint256 _price,
        string memory _tokenURI
    ) external {
        uint256 _tokenId = s_tokenId;
        s_estatePrice[_to][_tokenId] = _price;
        s_tokenId++;

        mint(_to, _tokenId, _tokenURI);
    }

    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenURI
    ) internal {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        emit NftMinted(_to, _tokenId, _tokenURI);
    }

    function transferItem(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        if (msg.value < s_estatePrice[_from][_tokenId]) {
            revert DecentralizedEstate__PriceNotMet();
        }
        delete (s_estatePrice[_from][_tokenId]);
        s_estatePrice[_to][_tokenId] = msg.value;
        s_proceedings[_from] = msg.value;

        // Emits an event Transfer(address, address, uint256)
        _safeTransfer(_from, _to, _tokenId);
    }

    function updateItem(
        address _owner,
        uint256 _tokenId,
        uint256 _newPrice
    ) external onlyNftOwner(_tokenId) {
        s_estatePrice[_owner][_tokenId] = _newPrice;
    }

    function withdrawProceedings() external {
        uint256 proceeds = s_proceedings[msg.sender];
        if (proceeds <= 0) {
            revert DecentralizedEstate__NoProceeds();
        }
        s_proceedings[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert DecentralizedEstate__TransferFailed();
        }
    }

    // Getter Functions //
    function getTokenId() external view returns (uint256) {
        return s_tokenId;
    }

    function getTokenUri(
        uint256 _tokenId
    ) external view onlyNftOwner(_tokenId) returns (string memory) {
        return tokenURI(_tokenId);
    }

    function getEstatePrice(
        address _owner,
        uint256 _tokenId
    ) external view onlyNftOwner(_tokenId) returns (uint256) {
        return s_estatePrice[_owner][_tokenId];
    }

    function getProceedings(address _owner) external view returns (uint256) {
        return s_proceedings[_owner];
    }
}
