<?php

/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-03-03 23:48:02
 */

namespace _sydSOFT_PHPBase;

class SYDFORM
{
	public function createForm($postAccept = [], $postExclude = []): array
	{
		//test
        $form = [];
		foreach ($_POST as $name => $value) {
			if (count($postAccept) > 0) {
				if (in_array($name, $postAccept, true)) {
					$form[$name] = $value;
				}
			} elseif (count($postExclude) > 0) {
				if (!in_array($name, $postExclude, true)) {
					$form[$name] = $value;
				}
			} else {
				$form[$name] = $value;
			}
		}
		return $form;
	}

	public function checkFormRequired(string $requiredFieldsName = 'requiredfields'): bool
	{
		if ($requiredFieldsName === '' || !isset($_POST[$requiredFieldsName])) {
			return true;
		}

		foreach (explode(',', (string) $_POST[$requiredFieldsName]) as $name) {
			$name = trim($name);
			if ($name === '') {
				continue;
			}

			if (!isset($_POST[$name]) || trim((string) $_POST[$name]) === '') {
				return false;
			}
		}

		return true;
	}

	public function checkSecurityCode(string $sessionName = 'guvenlikkodu'): bool
	{
		if (session_status() !== PHP_SESSION_ACTIVE) {
			session_start();
		}

		if (!isset($_POST[$sessionName])) {
			return false;
		}
		if (!isset($_SESSION[$sessionName])) {
			return false;
		}
		if ($_SESSION[$sessionName] !== $_POST[$sessionName]) {
			return false;
		}
		$_SESSION[$sessionName] = time();
		return true;
	}
}
