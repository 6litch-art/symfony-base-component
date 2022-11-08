<?php

namespace Base\Form\Model;

use Base\Form\Common\AbstractModel;
use Base\Validator\Constraints as AssertBase;

/**
 * @AssertBase\NotBlank
 */
class UserProfileModel extends AbstractModel
{
    /**
     * @var string
     */
    public $email;

    /**
     * @var string
     */
    public $plainPassword;

    /**
     * @var string
     */
    public $avatar;
}
