<?php

namespace Base\Controller\Dashboard;

use App\Entity\User              as User;
use App\Entity\User\Group        as UserGroup;
use App\Entity\User\Log          as UserLog;
use App\Entity\User\Token        as UserToken;
use App\Entity\User\Notification as UserNotification;
use App\Entity\User\Permission   as UserPermission;
use App\Entity\User\Penalty      as UserPenalty;

use App\Controller\Dashboard\Crud\User\UserCrudController;
use Base\Service\BaseService;
use Base\Field\Type\RoleType;

use Base\Config\WidgetItem;
use Base\Entity\Sitemap\Menu;
use Base\Entity\Sitemap\Widget\Page;
use Base\Entity\Sitemap\Setting;
use Base\Entity\Sitemap\Widget;
use Base\Entity\Sitemap\Widget\Attachment;
use Base\Entity\Sitemap\Widget\Hyperlink;
use Base\Entity\User\Notification;
use Base\Enum\UserRole;
use Base\Field\Type\DateTimePickerType;
use Base\Field\Type\ImageType;
use Base\Form\Type\Sitemap\SettingType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;

use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Provider\AdminContextProvider;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Google\Analytics\Service\GaService;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Twig\Environment;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;

use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class DashboardController extends AbstractDashboardController
{
    protected $baseService;
    protected $authenticationUtils;
    protected $adminUrlGenerator;

    public function __construct(
        AdminUrlGenerator $adminUrlGenerator,
        AdminContextProvider $adminContextProvider,
        BaseService $baseService,
        AuthenticationUtils $authenticationUtils,
        ?GaService $gaService = null
    ) {
        $this->adminUrlGenerator = $adminUrlGenerator;
        $this->adminContextProvider  = $adminContextProvider;

        $this->baseService = $baseService;
        $this->translator  = $baseService->getTwigExtension();
        $this->authenticationUtils       = $authenticationUtils;
        $this->gaService = $gaService;
    }

    /**
     * Link to this controller to start the "connect" process
     *
     * @Route("/dashboard", name="base_dashboard")
     */
    public function index(): Response
    {
        return $this->render('dashboard/index.html.twig', [
            "content_header" => $this->translator->trans2("Welcome to the administration page."),
            "content_widgets" => $this->configureWidgetItems()
        ]);
    }

    /**
     * Link to this controller to start the "connect" process
     *
     * @Route("/dashboard/settings", name="base_dashboard_settings")
     */
    public function Settings(Request $request): Response
    {
        $form = $this->createForm(SettingType::class, null, [
            "captcha_protection" => false,
            "fields" => [
                "base.settings.logo"                 => ["class" => ImageType::class],
                "base.settings.title"                => [],
                "base.settings.slogan"               => [],
                "base.settings.birthdate"            => ["class" => DateTimePickerType::class],
                "base.settings.maintenance"          => ["class" => CheckboxType::class, "required" => false],
                "base.settings.maintenance_downtime" => ["class" => DateTimePickerType::class, "required" => false],
                "base.settings.maintenance_uptime"   => ["class" => DateTimePickerType::class, "required" => false],
                "base.settings.use_https"            => ["class" => CheckboxType::class, "required" => false],
                "base.settings.domain"               => [],
                "base.settings.mail_name"            => [],
                "base.settings.mail"                 => ["class" => EmailType::class]
            ]
        ]);

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){

            $settingRepository = $this->getDoctrine()->getRepository(Setting::class);

            $data     = array_filter($form->getData(), fn($value) => !is_null($value));
            $fields   = array_keys($form->getConfig()->getOption("fields"));

            $settings = $this->baseService->getSettings()->getSettings($fields);
            $settings = array_filter($settings, fn($value) => !is_null($value));
            foreach(array_diff_key($data, $settings) as $name => $setting)
                $settingRepository->persist($setting);

            $settingRepository->flush();

            $notification = new Notification("dashboard.settings.success");
            $notification->setUser($this->getUser());
            $notification->send("success");

            return $this->baseService->refresh();
        }

        return $this->render('dashboard/settings.html.twig', [
            "content_title" => $this->translator->trans2("Dashboard: Settings"),
            "content_header" => $this->translator->trans2("Welcome to the setting page."),
            "form" => $form->createView()
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        $logo  = $this->baseService->getSettings("base.settings.logo") ?? "/bundles/base/logo.svg";
        $title = $this->baseService->getSettings("base.settings.title");
        return Dashboard::new()
            ->setTranslationDomain('dashboard')
            ->setTitle('<img src="'.$logo.'" alt="'.$title.'">')
            ->disableUrlSignatures();
    }

    public function configureCrud(): Crud
    {
        return Crud::new()
            ->setPaginatorPageSize(30)
            ->setFormOptions(
                ['validation_groups' => ['new']],
                ['validation_groups' => ['edit']]
            );
    }

    public function configureMenuItems(): iterable
    {
        $menu   = [];
        $menu[] = MenuItem::section(false);
        $menu[] = MenuItem::linkToUrl('Home', 'fa fa-home', $this->baseService->getUrl("base_dashboard"));
        $menu[] = MenuItem::linkToUrl('Settings', 'fa fa-tools', $this->baseService->getUrl("base_dashboard_settings"));
        $menu[] = MenuItem::linkToUrl('Back to website', 'fa fa-door-open', "/");

        $menu[] = MenuItem::section('MEMBERSHIP');
        $roles = RoleType::array_flatten(RoleType::getChoices());

        foreach ($roles as $label => $role) {

            if ($role == UserRole::USER) continue;
            $value = $label;
            $icon  = RoleType::getAltIcons()[$role] ?? "fa fa-fw";

            $url = $this->adminUrlGenerator
                ->unsetAll()
                ->setController(UserCrudController::class)
                ->setAction(Action::INDEX)
                ->set("role", $role)
                ->set("filters[roles][comparison]", "like")
                ->set("filters[roles][value]", $role)
                ->set("menuIndex", count($menu))
                ->generateUrl();

            $menu[] = MenuItem::linkToUrl($value, $icon, $url);
        }

        $menu[] = MenuItem::linkToCrud('All users', 'fa-fw fa fa-tags', User::class);
        $menu[] = MenuItem::linkToCrud('Add user', 'fa-fw fa fa-plus-circle', User::class)->setPermission('ROLE_SUPERADMIN')
            ->setAction('new');

        if (isset($this->gaService) && $this->gaService->isEnabled()) {

            $ga = $this->gaService->getBasics();

            $gaMenu = [];
            $gaMenu["users"]        = ["label" => $this->translator->trans2("dashboard.users", [$ga["users"]]), "icon"  => 'fas fa-user'];
            $gaMenu["users_1day"]   = ["label" => $this->translator->trans2("dashboard.users_1day", [$ga["users_1day"]]), "icon"  => 'fas fa-user-clock'];
            $gaMenu["views"]        = ["label" => $this->translator->trans2("dashboard.views", [$ga["views"]]), "icon"  => 'far fa-eye'];
            $gaMenu["views_1day"]   = ["label" => $this->translator->trans2("dashboard.views_1day", [$ga["views_1day"]]) , "icon"  => 'fas fa-eye'];
            $gaMenu["sessions"]     = ["label" => $this->translator->trans2("dashboard.sessions", [$ga["sessions"]]), "icon"  => 'fas fa-stopwatch'];
            $gaMenu["bounces_1day"] = ["label" => $this->translator->trans2("dashboard.bounces_1day", [$ga["bounces_1day"]]), "icon"  => 'fas fa-meteor'];

            $menu[] = MenuItem::section('STATISTICS');
            foreach ($gaMenu as $key => $entry) {

                $url = $this->adminUrlGenerator
                    ->unsetAll()
                    ->setRoute("app_dashboard_ga")
                    ->set("menuIndex", count($menu))
                    ->set("show", $key)
                    ->generateUrl();

                $menu[] = MenuItem::linkToUrl(
                    $entry["label"], $entry["icon"], $url);
            }
        }

        return $menu;
    }

    public function configureActions(): Actions
    {
        return parent::configureActions()
            ->update(Crud::PAGE_INDEX, Action::EDIT,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-pencil-alt'))
            ->update(Crud::PAGE_INDEX, Action::DELETE,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-trash-alt'))

            ->update(Crud::PAGE_DETAIL, Action::EDIT,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-pencil-alt'))
            ->update(Crud::PAGE_DETAIL, Action::INDEX,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-home'))
            ->update(Crud::PAGE_DETAIL, Action::DELETE,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-trash-alt'))

            ->update(Crud::PAGE_EDIT, Action::SAVE_AND_RETURN,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-save'))
            ->update(Crud::PAGE_EDIT, Action::SAVE_AND_CONTINUE,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-edit'))

            ->update(Crud::PAGE_NEW, Action::SAVE_AND_RETURN,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-edit'))
            ->update(Crud::PAGE_NEW, Action::SAVE_AND_ADD_ANOTHER,
                fn (Action $action) => $action->setIcon('fa fa-fw fa-edit'));

    }

    public function configureWidgetItems($widget = [])
    {
        WidgetItem::setAdminUrlGenerator($this->adminUrlGenerator);
        WidgetItem::setAdminContextProvider($this->adminContextProvider);

        $widget[] = WidgetItem::section('MEMBERSHIP', null, 2);
        $widget[] = WidgetItem::linkToCrud('Users',         'fa-fw fa fa-user',                 User::class);
        $widget[] = WidgetItem::linkToCrud('Groups',        'fa-fw fa fa-users',                UserGroup::class);
        $widget[] = WidgetItem::linkToCrud('Notifications', 'fa-fw fa fa-bell',                 UserNotification::class);
        $widget[] = WidgetItem::linkToCrud('Tokens',        'fa-fw fa fa-drumstick-bite',       UserToken::class);
        $widget[] = WidgetItem::linkToCrud('Permissions',   'fa-fw fa fa-exclamation-triangle', UserPermission::class);
        $widget[] = WidgetItem::linkToCrud('Penalties',     'fa-fw fa fa-bomb',                 UserPenalty::class);
        $widget[] = WidgetItem::linkToCrud('Logs',          'fa-fw fa fa-info-circle',          UserLog::class);

        $widget[] = WidgetItem::section('SITEMAP', null, 2);
        $widget[] = WidgetItem::linkToCrud('Pages',    'fa-fw fa fa-file-alt', Page::class);
        $widget[] = WidgetItem::linkToCrud('Hyperlinks',    'fa-fw fa fa-link', Hyperlink::class);
        $widget[] = WidgetItem::linkToCrud('Attachments',    'fa-fw fa fa-paperclip', Attachment::class);
        $widget[] = WidgetItem::linkToCrud('Menu',     'fa-fw fa fa-compass',  Menu::class);
        if ($this->isGranted('ROLE_SUPERADMIN'))
            $widget[] = WidgetItem::linkToCrud('Settings', 'fa-fw fa fa-tools',    Setting::class);

        return $widget;
    }

    public function configureUserMenu(UserInterface $user): UserMenu
    {
        // Usually it's better to call the parent method because that gives you a
        // user menu with some menu items already created ("sign out", "exit impersonation", etc.)
        // if you prefer to create the user menu from scratch, use: return UserMenu::new()->...
        $avatar = ($user->getAvatarFile() ? $user->getAvatar() : null);

        return parent::configureUserMenu($user)
            ->setAvatarUrl($avatar)
            ->addMenuItems([
                MenuItem::linkToUrl('My Profile', 'fa fa-id-card', $this->baseService->getUrl("base_profile")),
                MenuItem::linkToUrl('My Settings', 'fa fa-user-cog', $this->baseService->getUrl("base_settings"))
            ]);
    }
}
