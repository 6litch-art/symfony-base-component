<?php

namespace Base\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthAwareUserProviderInterface;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;

class UserProvider implements UserProviderInterface, PasswordUpgraderInterface, OAuthAwareUserProviderInterface
{
    // TODO: Remove the two next methods in S6.0
    public function loadUserByUsername($response) { return $this->loadUserByIdentifier($response); }
    // TODO-END

    /**
     * {@inheritdoc}
     */

    public function loadUserByIdentifier($response)
    {
        $data = $response->getData();

        $user = new User();
        $user->setId(0);
        $user->setRoles([User::ROLE_SOCIAL]);
        $user->setIsVerified($data["verified_email"]);
        $user->setEmail($data["email"]);

        if(method_exists(User::class, "setUsername" )) $user->setUsername("Google");
        if(method_exists(User::class, "setFirstname")) $user->setFirstname($data["given_name"]);
        if(method_exists(User::class, "setLastname" )) $user->setLastname($data["family_name"]);

        return $user;
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        return $this->loadUserByIdentifier($response);
    }

    /**
     * Refreshes the user after being reloaded from the session.
     *
     * When a user is logged in, at the beginning of each request, the
     * User object is loaded from the session and then this method is
     * called. Your job is to make sure the user's data is still fresh by,
     * for example, re-querying for fresh User data.
     *
     * If your firewall is "stateless: true" (for a pure API), this
     * method is not called.
     *
     * @return UserInterface
     */
    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof User)
            throw new UnsupportedUserException(sprintf('Invalid user class "%s".', get_class($user)));

        return $user;
    }

    /**
     * Tells Symfony to use this provider for this User class.
     */
    public function supportsClass(string $class)
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }

    /**
     * Upgrades the encoded password of a user, typically for using a better hash algorithm.
     */
    public function upgradePassword(UserInterface $user, string $newHashedPassword): void
    {
        // set the new hashed password on the User object
        $user->setPassword($newHashedPassword);
    }
}
