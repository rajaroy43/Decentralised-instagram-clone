// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;
pragma experimental ABIEncoderV2;

contract Instagram {
    string public name = "InstagramDapp";
    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmmount;
        address payable author;
    }
    uint256 public imageCount = 0;
    Image[] public allImage;
    mapping(uint256 => Image) public images;
    event ImageUploaded(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmmount,
        address payable author
    );

    // Create Images
    function uploadImage(string memory _imageHash, string memory _description)
        public
    {
        require(bytes(_imageHash).length > 0, "invalid ipfs hash");
        require(bytes(_description).length > 0, "invalid ipfs hash");
        require(msg.sender != address(0), "Imager Uploader is in real world");
        imageCount = imageCount + 1;
        images[imageCount] = Image(
            imageCount,
            _imageHash,
            _description,
            0,
            msg.sender
        );
        emit ImageUploaded(imageCount, _imageHash, _description, 0, msg.sender);
        allImage.push(images[imageCount]);
    }

    function allImages() public view returns (Image[] memory) {
        return allImage;
    }

    event ImageTipped(
        uint256 id,
        address postTipper,
        uint256 tipAmmount,
        string hash,
        string description
    );

    function tipImageOwner(uint256 _id) public payable {
        require(msg.value > 0, "Tip value can't be 0");
        require(_id > 0 && _id <= imageCount, "image not found");
        Image storage _image = images[_id];
        address payable _author = _image.author;
        _author.transfer(msg.value);
        _image.tipAmmount += msg.value;
        delete allImage[_id - 1];
        allImage[_id - 1] = _image;
        emit ImageTipped(
            _id,
            msg.sender,
            msg.value,
            _image.hash,
            _image.description
        );
    }
}
