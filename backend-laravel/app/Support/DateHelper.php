<?php

namespace App\Support;

use Carbon\Carbon;

class DateHelper
{
    /**
     * Parses a date string, handling Portuguese month names.
     */
    public static function parsePortugueseDate($dateString)
    {
        if (!$dateString) {
            return now();
        }

        $months = [
            'Janeiro' => 'January',
            'Fevereiro' => 'February',
            'Março' => 'March',
            'Abril' => 'April',
            'Maio' => 'May',
            'Junho' => 'June',
            'Julho' => 'July',
            'Agosto' => 'August',
            'Setembro' => 'September',
            'Outubro' => 'October',
            'Novembro' => 'November',
            'Dezembro' => 'December',
            'Jan' => 'Jan',
            'Fev' => 'Feb',
            'Mar' => 'Mar',
            'Abr' => 'Apr',
            'Mai' => 'May',
            'Jun' => 'Jun',
            'Jul' => 'Jul',
            'Ago' => 'Aug',
            'Set' => 'Sep',
            'Out' => 'Oct',
            'Nov' => 'Nov',
            'Dez' => 'Dec',
        ];

        // Replace Portuguese versions with English versions
        $translatedDate = str_ireplace(array_keys($months), array_values($months), $dateString);

        try {
            return Carbon::parse($translatedDate);
        } catch (\Exception $e) {
            // Fallback to now if parsing still fails
            return now();
        }
    }
}
